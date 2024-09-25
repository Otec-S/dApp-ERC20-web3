import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { Address } from 'viem';

import ArrowDown from '@assets/icons/arrow_down.svg';

import FormButton from '../form-button/FormButton';
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
}

const NewOfferForm: FC = () => {
  const [showLeftTokenPopup, setShowLeftTokenPopup] = useState(false);
  const [showRightTokenPopup, setShowRightTokenPopup] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);
  console.log(errors);
  const handleLeftTokenPopupOpen = () => {
    setShowLeftTokenPopup(true);
  };
  const handleRightTokenPopupOpen = () => {
    setShowRightTokenPopup(true);
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
                  {...register('from', { required: true })}
                />
                {showLeftTokenPopup && <TokenPopup onCLose={handleTokenPopupClose} onSelect={handleTokenPopupClose} />}
                <div onPointerDown={handleLeftTokenPopupOpen} className={styles.tokenPopup}>
                  <ArrowDown />
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
                  {...register('to', { required: true })}
                />
                {showRightTokenPopup && <TokenPopup onCLose={handleTokenPopupClose} onSelect={handleTokenPopupClose} />}
                <div onPointerDown={handleRightTokenPopupOpen} className={styles.tokenPopup}>
                  <ArrowDown />
                </div>
                <button className={styles.buttonAddCustomToken} type="button">
                  + Add a custom token
                </button>
              </label>
            </div>
            <label className={styles.labelRate}>
              <input className={styles.inputRate} type="text" placeholder="0" {...register('rate', { required: true })} />
              <span className={styles.labelText}>Rate</span>
            </label>
            <label className={styles.labelReceiver}>
              <input className={styles.inputReceiver} type="text" placeholder="0x0000000000000000000000000000000000000000" {...register('receiver')} />
              <span className={styles.labelText}>Receiver</span>
            </label>
            <label>
              Infinite approve
              <input type="checkbox" name="infinite" />
            </label>
          </div>
          <div className={styles.buttons}>
            <FormButton type="button" buttonText="Approve Token" disabled />
            <FormButton type="button" buttonText="Create Trade" disabled />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewOfferForm;
