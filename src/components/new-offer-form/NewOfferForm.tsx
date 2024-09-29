import { CSSProperties, FC, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address, erc20Abi, formatUnits, isAddress, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';

import ArrowDown from '@assets/icons/arrow_down.svg';
import WarningIcon from '@assets/icons/warning_icon.svg';
import { IToken, tradeContractAbi, tradeContractAddress } from '@src/shared/constants';
import getTokenIcon from '@src/utils/getTokenIcon';
import isNumber from '@src/utils/isNumber';

import AddTokenInfo from '../add-token-info-popup/AddTokenInfo';
import FormButton from '../form-button/FormButton';
import { StepPagination } from '../StepPagination/StepPagination';
import { StepStatus } from '../StepPagination/StepPagination.interface';
import { TokenPopup } from '../TokenPopup/TokenPopup';
import { NewOfferFormStages } from './NewOfferFormStages';
import styles from './NewOfferForm.module.css';

interface FormData {
  from: number;
  to: number;
  tokenFrom: Address;
  tokenTo: Address;
  rate: number;
  optionalTaker: Address;
  approve: boolean;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

interface TokenDataNewOfferForm {
  address: Address;
  decimals: number;
  name: string;
}

type FormStages = 'approveToken' | 'createTrade' | 'tradeCreated';

const NewOfferForm: FC = () => {
  const [showLeftTokenPopup, setShowLeftTokenPopup] = useState(false);
  const [showRightTokenPopup, setShowRightTokenPopup] = useState(false);
  const [showCustomTokenPopup, setShowCustomTokenPopup] = useState(false);
  const [formStage, setFormStage] = useState<FormStages>('approveToken');
  const [tokenFrom, setTokenFrom] = useState<TokenDataNewOfferForm | undefined>(undefined);
  const [tokenTo, setTokenTo] = useState<TokenDataNewOfferForm | undefined>(undefined);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode:'onChange'
  });

  const { isConnected, chainId, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  useEffect(() => {
    reset();
    setTokenFrom(undefined);
    setTokenTo(undefined);
  }, [chainId, reset]);

  const { data: contractData, isLoading: isLoadingBalance } = useReadContracts({
    query: {
      refetchInterval: 30 * 1000, //30 sec
    },
    allowFailure: false,
    contracts: walletAddress &&
      tokenFrom?.address &&
      tokenFrom && [
        {
          address: tokenFrom.address,
          functionName: 'balanceOf',
          abi: erc20Abi,
          args: [walletAddress],
        },
      ],
  });

  const { data: feeBasis } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
        functionName: 'feeBasisPoints',
        abi: tradeContractAbi,
      },
    ],
  });
  const fee = feeBasis && formatUnits(feeBasis[0], 2);
  const tokenAmountIsTaken = fee && getValues('from') && isNumber(getValues('from')) && getValues('from') * Number(fee);
  const tokenAmountOfReceiver = tokenAmountIsTaken && getValues('from') && getValues('from') - tokenAmountIsTaken;

  const {
    writeContract,
    isPending: isWriteApprovePending,
    isSuccess: isWriteContractSuccess,
    data: transactionHash,
    variables: contractVariables,
  } = useWriteContract();

  const onSubmit: SubmitHandler<FormData> = () => {
    if (!errors.from && tokenFrom && walletAddress && formStage === 'approveToken') {
      writeContract({
        abi: erc20Abi,
        address: tokenFrom.address,
        functionName: 'approve',
        args: [
          chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
          parseUnits(getValues('from').toString(), tokenFrom?.decimals),
        ],
      });
    } else if (formStage === 'createTrade' && tokenFrom && tokenTo && !errors.from && !errors.to && walletAddress) {
      writeContract({
        abi: tradeContractAbi,
        address: chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
        functionName: 'initiateTrade',
        args: [
          tokenFrom.address,
          tokenTo.address,
          parseUnits(getValues('from').toString(), tokenFrom.decimals),
          parseUnits(getValues('to').toString(), tokenTo.decimals),
          walletAddress,
        ],
      });
    }
  };

  useEffect(() => {
    if (formStage === 'approveToken' && isWriteContractSuccess) {
      setFormStage('createTrade');
    }
    if (formStage === 'createTrade' && isWriteContractSuccess && contractVariables.functionName === 'initiateTrade') {
      setFormStage('tradeCreated');
    }
  }, [formStage, setFormStage, isWriteContractSuccess, contractVariables]);

  const handleTokenPopupOpen = (tokenToOpen: 'from' | 'to' | 'customFrom' | 'customTo') => {
    switch (tokenToOpen) {
      case 'from':
        setShowLeftTokenPopup(true);
        break;
      case 'to':
        setShowRightTokenPopup(true);
        break;
    }
  };

  const handleCustomTokenPopupOpen = () => {
    setShowCustomTokenPopup(true);
  };

  const balanceOfTokenFrom = tokenFrom && contractData && parseFloat(formatUnits(contractData?.[0], tokenFrom?.decimals));

  const handleDefaultTokenChoice = (token: IToken, tokenSelected: 'from' | 'to') => {
    switch (tokenSelected) {
      case 'from':
        setTokenFrom({
          address: chainId === sepolia.id ? token.sepoliaAddress : token.polygonAddress,
          decimals: token.decimals,
          name: token.name,
        });
        setShowLeftTokenPopup(false);
        break;
      case 'to':
        setTokenTo({
          address: chainId === sepolia.id ? token.sepoliaAddress : token.polygonAddress,
          decimals: token.decimals,
          name: token.name,
        });
        setShowRightTokenPopup(false);
        break;
    }
  };

  const handleTokenPopupClose = () => {
    setShowLeftTokenPopup(false);
    setShowRightTokenPopup(false);
    setShowCustomTokenPopup(false);
  };

  const handleSetTokenMaxValue = () => {
    setValue('from', Number(contractData && tokenFrom && formatUnits(contractData?.[0], tokenFrom?.decimals)));
  };
  const rate = watch('from') >0 ? watch('to') / watch('from') : 0;
  setValue('rate', rate);

  const showApproveButtonDisabled = tokenFrom === undefined;

  return (
    <section className={cn(styles.createOffer)}>
      <div className={styles.customTokenContainer}>
        {showCustomTokenPopup && <AddTokenInfo colorScheme="yellow" onClosePopup={handleTokenPopupClose} />}
      </div>
      {(isLoadingBalance || isWriteApprovePending) && (
        <div className={styles.loader}>
          <BeatLoader
            color={'red'}
            loading={true}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className={styles.headerWrapper}>
        <h2 className={styles.header}>{formStage !== 'tradeCreated' ? 'New offer' : 'New offer has been created!'}</h2>
        {formStage !== 'tradeCreated' && (
          <NewOfferFormStages
            description={formStage === 'createTrade' ? 'Create' : 'Approve'}
            activeStage={formStage === 'createTrade' ? 2 : 1}
          />
        )}
      </div>
      {formStage !== 'tradeCreated' && (
        <div className={cn(styles.formWrapper)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={cn(styles.inputs, { [styles.inputsAfterTokenApproval]: isWriteContractSuccess })}>
              <div className={styles.inputsWraper}>
                <label className={styles.label}>
                  From
                  <input
                    className={cn(styles.inputQuantity,{[styles.inputQuantityError]:errors.from?.type === 'validate'})}
                    type="number"
                    step="0.000000000000000001"
                    placeholder='0'
                    {...register('from', { required: true, validate: (value) =>  balanceOfTokenFrom ? value > 0 && value <= balanceOfTokenFrom : value > 0 })}
                  />
                  {errors.from?.type === 'required' && (
                    <div className={styles.error}>
                      {
                        <div className={styles.warningIcon}>
                          <WarningIcon />
                        </div>
                      }
                      {' Required field'}
                    </div>
                  )}
                  {errors.from?.type === 'validate' && (
                    <div className={styles.error}>
                      {
                        <div className={styles.warningIcon}>
                          <WarningIcon />
                        </div>
                      }
                      {' Unsufficient balance'}
                    </div>
                  )}
                  {!errors.from && contractData && (
                    <div className={styles.tokenBalanceWrapper}>
                      <span className={styles.tokenBalance}>
                        {`Balance: ${balanceOfTokenFrom}`}
                      </span>
                      <button
                        onPointerDown={handleSetTokenMaxValue}
                        className={styles.tokenBalanceButton}
                        type="button"
                      >
                        Max
                      </button>
                    </div>
                  )}
                  {showLeftTokenPopup && (
                    <TokenPopup
                      onCLose={handleTokenPopupClose}
                      onSelect={(data) => handleDefaultTokenChoice(data, 'from')}
                      colorScheme="light"
                    />
                  )}
                  <div onPointerDown={() => handleTokenPopupOpen('from')} className={styles.tokenPopup}>
                    <div className={styles.tokenIcon}>{tokenFrom?.address && getTokenIcon(tokenFrom?.address)}</div>
                    <div className={styles.tokenArrow}>
                      <ArrowDown />
                    </div>
                  </div>
                  <button
                    onPointerDown={handleCustomTokenPopupOpen}
                    className={styles.buttonAddCustomToken}
                    type="button"
                  >
                    + Add a custom token
                  </button>
                </label>
                <label className={styles.label}>
                  To
                  <input
                    className={styles.inputQuantity}
                    type="number"
                    step="0.000000000000000001"
                    placeholder='0'
                    {...register(
                      'to',
                      isWriteContractSuccess
                        ? { required: true, validate: (value) => isNumber(value) && value > 0 }
                        : undefined,
                    )}
                  />
                  {errors.to?.type === 'required' && (
                    <div className={styles.error}>
                      {
                        <div className={styles.warningIcon}>
                          <WarningIcon />
                        </div>
                      }
                      {' Required field'}
                    </div>
                  )}
                  {errors.to?.type === 'validate' && (
                    <div className={styles.error}>
                      {
                        <div className={styles.warningIcon}>
                          <WarningIcon />
                        </div>
                      }
                      {' Unsufficient balance'}
                    </div>
                  )}
                  {showRightTokenPopup && (
                    <TokenPopup
                      onCLose={handleTokenPopupClose}
                      onSelect={(token) => handleDefaultTokenChoice(token, 'to')}
                      colorScheme="light"
                    />
                  )}
                  <div onPointerDown={() => handleTokenPopupOpen('to')} className={styles.tokenPopup}>
                    <div className={styles.tokenIcon}>{tokenTo?.address && getTokenIcon(tokenTo?.address)}</div>
                    <div className={styles.tokenArrow}>
                      <ArrowDown />
                    </div>
                  </div>
                  <button
                    onPointerDown={handleCustomTokenPopupOpen}
                    className={styles.buttonAddCustomToken}
                    type="button"
                  >
                    + Add a custom token
                  </button>
                </label>
              </div>
              <div className={styles.additionalInputsWrapper}>
                <label className={styles.labelRate}>
                  <input
                    className={styles.inputRate}
                    type="text"
                    readOnly={true}
                    placeholder="0"
                    {...register('rate')}
                  />
                  <span className={styles.labelText}>Rate</span>
                </label>
                <label className={styles.labelReceiver}>
                  <input
                    className={styles.inputReceiver}
                    type="text"
                    defaultValue="0x0000000000000000000000000000000000000000"
                    {...register('optionalTaker', { validate: (value) => isAddress(value) })}
                  />
                  <span className={styles.labelText}>Receiver</span>
                  {errors.optionalTaker?.type === 'validate' && (
                    <div className={styles.optionalTakerError}>
                      {
                        <div className={styles.warningIcon}>
                          <WarningIcon />
                        </div>
                      }
                      {' Please input address'}
                    </div>
                  )}
                </label>
              </div>
              <div className={styles.approveWrraper}>
                <span className={styles.fee}>
                  {fee && `Service fee ${fee}% `}
                  {tokenFrom && tokenAmountIsTaken && `(${tokenAmountIsTaken} ${tokenFrom.name})`}
                  {'.'}
                  {tokenFrom &&
                    getValues('from') &&
                    isNumber(getValues('from')) &&
                    `Receiver will get ${tokenAmountOfReceiver} ${tokenFrom.name}`}
                </span>
                <div>
                  <input type="checkbox" id="infiniteapprove" {...register('approve')} />
                  <label htmlFor="infiniteapprove" className={styles.approve}>
                    Infinite approve
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <div className={styles.buttonsWrapper}>
                {formStage === 'approveToken' && (
                  <FormButton
                    colorScheme="yellow"
                    type="submit"
                    buttonText="Approve Token"
                    disabled={showApproveButtonDisabled}
                  />
                )}
                <FormButton
                  colorScheme="yellow"
                  type="submit"
                  buttonText="Create Trade"
                  disabled={formStage !== 'createTrade' || tokenFrom === undefined || tokenTo === undefined}
                />
              </div>
              <StepPagination
                steps={
                  showApproveButtonDisabled
                    ? [
                        { value: 1, status: StepStatus.DISABLED },
                        { value: 2, status: StepStatus.DISABLED },
                      ]
                    : [
                        { value: 1, status: StepStatus.COMPLETED },
                        { value: 2, status: StepStatus.DISABLED },
                      ]
                }
              />
            </div>
          </form>
        </div>
      )}
      {formStage === 'tradeCreated' && (
        <div className={styles.clipboard}>
          <h5 className={styles.clipboardHeader}>Share link</h5>
          <CopyToClipboard
            text={
              chainId === sepolia.id
                ? `https://sepolia.etherscan.io/tx/${transactionHash}`
                : `https://www.oklink.com/ru/amoy/tx/${transactionHash}`
            }
          >
            <div className={styles.clipboardLink}>Copy link</div>
          </CopyToClipboard>
        </div>
      )}
    </section>
  );
};

export default NewOfferForm;
