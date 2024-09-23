import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { Address } from 'viem';

import styles from './NewOfferForm.module.css';

interface FormData {
  from: number;
  to: number;
  tokenFrom:Address;
  tokenTo:Address;
  rate:string;
  receiver:string;
}

const NewOfferForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit:SubmitHandler<FormData> = (data) => console.log(data);
  console.log(errors);

  return (
    <section className={cn(styles.createOffer)}>
      <h2 className={styles.header}>New offer</h2>
      <div className={cn(styles.formWrapper)}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputs}>
          <label>
            From
            <input type="text" placeholder="from" {...register('from', { required: true })} />
            <select {...register('tokenFrom', { required: true })}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          </label>
          <label>
            To
            <input type="text" placeholder="to" {...register('to', { required: true })} />
            <select {...register('tokenTo', { required: true })}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          </label>
          <label>
            <input type="text" placeholder="Rate" {...register('rate', { required: true })} />
          </label>
          <label>
            <input type="text" placeholder="Receiver" {...register('receiver')} />
          </label>
          <input type="checkbox" placeholder='Infinite approve' name="infinite" />
          </div>
          <div className={styles.buttons}>
            <input type="submit" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewOfferForm;
