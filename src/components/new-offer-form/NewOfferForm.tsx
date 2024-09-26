import { CSSProperties, FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address, erc20Abi, formatUnits } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useReadContracts } from 'wagmi';

import ArrowDown from '@assets/icons/arrow_down.svg';
import { IToken } from '@src/shared/constants';

import { TokenData } from '../add-token-info-popup/AddTokenInfo';
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
  rate: string;
  receiver: string;
  approve: boolean;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const NewOfferForm: FC = () => {
  const [showLeftTokenPopup, setShowLeftTokenPopup] = useState(false);
  const [showRightTokenPopup, setShowRightTokenPopup] = useState(false);
  const [tokenFrom, setTokenFrom] = useState<IToken | undefined | TokenData>(undefined);
  const [tokenTo, setTokenTo] = useState<IToken | undefined>(undefined);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isConnected, chainId, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //
  const { data: contractData, isLoading: isLoadingBalance } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress &&
      tokenFrom && [
        {
          address: (tokenFrom as IToken).sepoliaAddress,
          functionName: 'decimals',
          abi: erc20Abi,
        },
        {
          address: (tokenFrom as IToken).sepoliaAddress,
          functionName: 'balanceOf',
          abi: erc20Abi,
          args: [walletAddress],
        },
      ],
  });
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);
  // console.log(errors);
  const handleLeftTokenPopupOpen = () => {
    setShowLeftTokenPopup(true);
  };
  const handleRightTokenPopupOpen = () => {
    setShowRightTokenPopup(true);
  };
  const handleLeftTokenChoice = (data: IToken) => {
    setTokenFrom(data);
    setShowLeftTokenPopup(false);
  };
  const handleRightTokenChoice = (data: IToken) => {
    setTokenTo(data);
    setShowRightTokenPopup(false);
  };
  const handleTokenPopupClose = () => {
    setShowLeftTokenPopup(false);
    setShowRightTokenPopup(false);
  };
  const handleSetTokenMaxValue = () => {
    setValue('from', Number(contractData && formatUnits(contractData?.[1], contractData?.[0])));
  };

  return (
    <section className={cn(styles.createOffer)}>
      {isLoadingBalance && (
        <div className={styles.loader}>
          <BeatLoader
            color={'red'}
            loading={isLoadingBalance}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className={styles.headerWrapper}>
        <h2 className={styles.header}>New offer</h2>
        <NewOfferFormStages activeStage={2} />
      </div>
      <div className={cn(styles.formWrapper)}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputs}>
            <div className={styles.inputsWraper}>
              <label className={styles.label}>
                From
                <input
                  className={styles.inputQuantity}
                  type="text"
                  placeholder="0"
                  defaultValue={0}
                  {...register('from', { required: true })}
                />
                {contractData && (
                  <div className={styles.tokenBalanceWrapper}>
                    {}
                    <span className={styles.tokenBalance}>
                      {contractData &&
                        `Balance: ${contractData?.[1] && contractData?.[0] && parseFloat(formatUnits(contractData?.[1], contractData?.[0])).toFixed(2)}`}
                    </span>
                    <button onPointerDown={handleSetTokenMaxValue} className={styles.tokenBalanceButton} type="button">
                      Max
                    </button>
                  </div>
                )}
                {showLeftTokenPopup && <TokenPopup onCLose={handleTokenPopupClose} onSelect={handleLeftTokenChoice} />}
                <div onPointerDown={handleLeftTokenPopupOpen} className={styles.tokenPopup}>
                  <div className={styles.tokenIcon}>{tokenFrom?.icon}</div>
                  <div className={styles.tokenArrow}>
                    <ArrowDown />
                  </div>
                </div>
                <button className={styles.buttonAddCustomToken} type="button">
                  + Add a custom token
                </button>
              </label>
              <label className={styles.label}>
                To
                <input
                  className={styles.inputQuantity}
                  type="text"
                  placeholder="0"
                  defaultValue={0}
                  {...register('to', { required: true })}
                />
                {showRightTokenPopup && (
                  <TokenPopup onCLose={handleTokenPopupClose} onSelect={handleRightTokenChoice} />
                )}
                <div onPointerDown={handleRightTokenPopupOpen} className={styles.tokenPopup}>
                  <div className={styles.tokenIcon}>{tokenTo?.icon}</div>
                  <div className={styles.tokenArrow}>
                    <ArrowDown />
                  </div>
                </div>
                <button className={styles.buttonAddCustomToken} type="button">
                  + Add a custom token
                </button>
              </label>
            </div>
            <label className={styles.labelRate}>
              <input
                className={styles.inputRate}
                type="text"
                placeholder="0"
                {...register('rate', { required: true })}
              />
              <span className={styles.labelText}>Rate</span>
            </label>
            <label className={styles.labelReceiver}>
              <input
                className={styles.inputReceiver}
                type="text"
                placeholder="0x0000000000000000000000000000000000000000"
                {...register('receiver')}
              />
              <span className={styles.labelText}>Receiver</span>
            </label>
            <div className={styles.approveWrraper}>
              <input type="checkbox" id="infiniteapprove" {...register('approve')} />
              <label htmlFor="infiniteapprove" className={styles.approve}>
                Infinite approve
              </label>
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.buttonsWrapper}>
              <FormButton colorScheme="yellow" type="submit" buttonText="Approve Token" />
              <FormButton type="button" buttonText="Create Trade" disabled />
            </div>
            <StepPagination
              steps={[
                { value: 1, status: StepStatus.DISABLED },
                { value: 2, status: StepStatus.DISABLED },
              ]}
            />
          </div>
        </form>
      </div>
      <TokenPopup colorScheme='light' onCLose={() => undefined} onSelect={() => undefined} />
    </section>
  );
};

export default NewOfferForm;
