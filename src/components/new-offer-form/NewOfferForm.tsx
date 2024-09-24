import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { Address } from 'viem';

import { tokens } from '@src/shared/constants';

import FormButton from '../form-button/FormButton';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);
  console.log(errors);

  return (
    <section className={cn(styles.createOffer)}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.header}>New offer</h2>
        <NewOfferFormStages activeStage={2} />
      </div>
      <div className={cn(styles.formWrapper)}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputs}>
            <label>
              From
              <input type="text" placeholder="from" {...register('from', { required: true })} />
              <select {...register('tokenFrom', { required: true })}>
                {tokens.map((token) => {
                  return (
                    <option key={token.name} value={token.name}>
                      {token.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              To
              <input type="text" placeholder="to" {...register('to', { required: true })} />
              <select {...register('tokenTo', { required: true })}>
                {tokens.map((token) => {
                  return (
                    <option key={token.sepoliaAddress} value={token.name}>
                      {token.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              <input type="text" placeholder="Rate" {...register('rate', { required: true })} />
            </label>
            <label>
              <input type="text" placeholder="Receiver" {...register('receiver')} />
            </label>
            <label>Infinite approve
              <input type="checkbox" name="infinite" />
            </label>
          </div>
          <div className={styles.buttons}>
            <FormButton type='button' buttonText='Approve Token' disabled/>
            <FormButton type='button' buttonText='Create Trade' disabled/>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewOfferForm;
