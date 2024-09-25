import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import ArrowDown from '@assets/icons/arrow_down.svg';
import { IToken } from '@src/shared/constants';

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

const NewOfferForm: FC = () => {
  const [showLeftTokenPopup, setShowLeftTokenPopup] = useState(false);
  const [showRightTokenPopup, setShowRightTokenPopup] = useState(false);
  const [tokenFrom, setTokenFrom] = useState<IToken | undefined>(undefined);
  const [tokenTo, setTokenTo] = useState<IToken | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isConnected, address: walletAddress, chainId } = useAccount();
  console.log(chainId);
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }
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

  return (
    <section className={cn(styles.createOffer)}>
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
            <StepPagination steps={[{value:1,status:StepStatus.DISABLED},{value:2,status:StepStatus.DISABLED}]} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewOfferForm;
