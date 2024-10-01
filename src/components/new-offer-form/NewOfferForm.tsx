import { CSSProperties, FC, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address, erc20Abi, formatUnits, isAddress, maxUint256, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';

import ArrowDown from '@assets/icons/arrow_down.svg';
import WarningIcon from '@assets/icons/warning_icon.svg';
import { ITokens, tradeContractAbi, tradeContractAddress } from '@src/shared/constants';
import getTokenIcon from '@src/utils/getTokenIcon';
import isNumber from '@src/utils/isNumber';

import AddTokenInfo, { TokenData } from '../add-token-info-popup/AddTokenInfo';
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
  infiniteApprove: boolean;
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
  const [showDefaultTokenPopupFrom, setShowDefaultTokenPopupFrom] = useState(false);
  const [showDefaultTokenPopupTo, setShowDefaultTokenPopupTo] = useState(false);
  const [showCustomTokenPopupFrom, setShowCustomTokenPopupFrom] = useState(false);
  const [showCustomTokenPopupTo, setShowCustomTokenPopupTo] = useState(false);
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
    mode: 'onChange',
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

  const { data: balanceData, isLoading: isLoadingBalance } = useReadContract({
    query: {
      refetchInterval: 30 * 1000, //30 sec
    },
    abi:erc20Abi,
    functionName:'balanceOf',
    address: tokenFrom && tokenFrom.address,
    args: walletAddress && [walletAddress],
  });

  const { data: contractsConstants, isLoading: isLoadingContractData } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
        functionName: 'feeBasisPoints',
        abi: tradeContractAbi,
      },
      {
        address: tokenFrom?.address,
        functionName: 'allowance',
        abi: erc20Abi,
        args: walletAddress && [
          walletAddress,
          chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
        ],
      },
    ],
  });

  const fee = contractsConstants && formatUnits(contractsConstants[0], 2);
  const tokenAmountIsTaken = fee && getValues('from') && isNumber(getValues('from')) && getValues('from') * Number(fee);
  const tokenAmountOfReceiver = tokenAmountIsTaken && getValues('from') && getValues('from') - tokenAmountIsTaken;
  let serviceFee = fee && `Service fee ${fee}% `;
  serviceFee = tokenFrom && tokenAmountIsTaken ? serviceFee + `(${tokenAmountIsTaken} ${tokenFrom.name}).` : serviceFee;
  serviceFee =
    tokenFrom && getValues('from') && isNumber(getValues('from'))
      ? serviceFee + `Receiver will get ${tokenAmountOfReceiver} ${tokenFrom.name}`
      : serviceFee;

  const {
    writeContract,
    isPending: isWriteApprovePending,
    isSuccess: isWriteContractSuccess,
    data: transactionHash,
    error:writeContractError,
    variables: contractVariables,
  } = useWriteContract();

  const onSubmit: SubmitHandler<FormData> = () => {
    if (!errors.from && tokenFrom && walletAddress && formStage === 'approveToken') {
      const tokensToSpend = getValues('infiniteApprove')
        ? maxUint256
        : parseUnits(getValues('from').toString(), tokenFrom.decimals);
        
      const tokensAllowedToSpend = contractsConstants && contractsConstants[1];
      if (tokensAllowedToSpend!==undefined && tokensToSpend > tokensAllowedToSpend) {
        writeContract({
          abi: erc20Abi,
          address: tokenFrom.address,
          functionName: 'approve',
          args: [
            chainId === sepolia.id ? tradeContractAddress.sepolyaAddress : tradeContractAddress.polygonAddress,
            tokensToSpend,
          ],
        });
      } else setFormStage('createTrade');
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
          getValues('optionalTaker'),
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
    if(writeContractError) {
      toast.error('Error ' + writeContractError.name)
    }
  }, [formStage, setFormStage, isWriteContractSuccess, contractVariables,writeContractError]);

  const handleTokenPopupOpen = (tokenToOpen: 'from' | 'to' | 'customFrom' | 'customTo') => {
    switch (tokenToOpen) {
      case 'from':
        setShowDefaultTokenPopupFrom(true);
        break;
      case 'to':
        setShowDefaultTokenPopupTo(true);
        break;
      case 'customFrom':
        setShowCustomTokenPopupFrom(true);
        break;
      case 'customTo':
        setShowCustomTokenPopupTo(true);
        break;
    }
  };

  const balanceOfTokenFrom =
    tokenFrom && balanceData && parseFloat(formatUnits(balanceData, tokenFrom?.decimals));

  const handleDefaultTokenChoice = (token: ITokens, tokenSelected: 'from' | 'to') => {
    switch (tokenSelected) {
      case 'from':
        setTokenFrom({
          address: chainId === sepolia.id ? token.sepoliaAddress : token.polygonAddress,
          decimals: token.decimals,
          name: token.name,
        });
        setShowDefaultTokenPopupFrom(false);
        break;
      case 'to':
        setTokenTo({
          address: chainId === sepolia.id ? token.sepoliaAddress : token.polygonAddress,
          decimals: token.decimals,
          name: token.name,
        });
        setShowDefaultTokenPopupTo(false);
        break;
    }
  };

  const handleTokenPopupClose = () => {
    setShowDefaultTokenPopupFrom(false);
    setShowDefaultTokenPopupTo(false);
  };

  const handleCustomTokenPopupChoice = (token: TokenData, tokenSelected: 'from' | 'to') => {
    if (token.requestWasSuccessful && token.tokenAddress && token.tokenDecimals && token.tokenName) {
      switch (tokenSelected) {
      case 'from':
        setTokenFrom({
          address: token.tokenAddress,
          decimals: token.tokenDecimals,
          name: token.tokenName,
        });
        setShowCustomTokenPopupFrom(false);
        break;
      case 'to':
        setTokenTo({
          address: token.tokenAddress,
          decimals: token.tokenDecimals,
          name: token.tokenName,
        });
        setShowCustomTokenPopupTo(false);
        break; 
      }
    }
  };

  const handleSetTokenMaxValue = () => {
    setValue('from', Number(balanceData && tokenFrom && formatUnits(balanceData, tokenFrom?.decimals)));
  };
  const rate = watch('from') > 0 ? watch('to') / watch('from') : 0;
  setValue('rate', rate);

  const showApproveButtonDisabled = tokenFrom === undefined;
  const dataFromNetworkIsLoading = isLoadingBalance || isWriteApprovePending || isLoadingContractData;

  return (
    <section className={cn(styles.createOffer)}>
      <Toaster position="top-center"/>
      {showCustomTokenPopupTo && (
        <div className={styles.customTokenContainer}>
          <AddTokenInfo colorScheme="yellow" onClosePopup={(data) => handleCustomTokenPopupChoice(data, 'to')} />
        </div>
      )}
      {showCustomTokenPopupFrom && (
        <div className={styles.customTokenContainer}>
          <AddTokenInfo colorScheme="yellow" onClosePopup={(data) => handleCustomTokenPopupChoice(data, 'from')} />
        </div>
      )}
      {dataFromNetworkIsLoading && (
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
            <div className={styles.inputs}>
              <div className={styles.inputsWraper}>
                <label className={styles.label}>
                  From
                  <input
                    className={cn(styles.inputQuantity, {
                      [styles.inputQuantityError]: errors.from?.type === 'validate',
                    })}
                    type="number"
                    step="0.000000000000000001"
                    placeholder="0"
                    {...register('from', {
                      required: true,
                      validate: (value) => (balanceOfTokenFrom ? value > 0 && value <= balanceOfTokenFrom : value > 0),
                    })}
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
                  {!errors.from && balanceData!==undefined && (
                    <div className={styles.tokenBalanceWrapper}>
                      <span className={styles.tokenBalance}>{`Balance: ${balanceOfTokenFrom}`}</span>
                      <button
                        onPointerDown={handleSetTokenMaxValue}
                        className={styles.tokenBalanceButton}
                        type="button"
                      >
                        Max
                      </button>
                    </div>
                  )}
                  {showDefaultTokenPopupFrom && (
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
                    onPointerDown={() => handleTokenPopupOpen('customFrom')}
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
                    placeholder="0"
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
                  {showDefaultTokenPopupTo && (
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
                    onPointerDown={() => handleTokenPopupOpen('customTo')}
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
                <span className={styles.fee}>{serviceFee}</span>
                <div>
                  <input type="checkbox" id="infiniteapprove" {...register('infiniteApprove')} />
                  <label htmlFor="infiniteapprove" className={styles.approve}>
                    Infinite approve
                  </label>
                </div>
              </div>
            </div>
            <div className={cn(styles.buttons, { [styles.buttonsAfterTokenApproval]: formStage === 'createTrade' })}>
              <span className={styles.helpText}>
                {formStage === 'approveToken'
                  ? 'To create an offer, you will have to sign two transactions: Approve and Create'
                  : 'You approved token allowance. Now you’re one click away from Create Trade'}
              </span>
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
