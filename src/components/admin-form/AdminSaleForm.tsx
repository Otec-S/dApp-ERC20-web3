import { FC } from 'react';
import { useForm } from 'react-hook-form';

import FormButton from '@components/form-button/FormButton';

import styles from './AdminSaleForm.module.css';

enum SaleStatus {
  SOON = 0,
  AVAILABLE = 1,
  FINISHED = 2,
}

interface FormData {
  airdrope: SaleStatus;
  publicSale: SaleStatus;
  whiteListSale: SaleStatus;
}

export const AdminSaleForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select airdrop state:</legend>
        <div>
          <input type="radio" id="airdrope0" value={SaleStatus.SOON} {...register('airdrope')} />
          <label className={styles.label} htmlFor="airdrope0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="airdrope1" value={SaleStatus.AVAILABLE} {...register('airdrope')} />
          <label className={styles.label} htmlFor="airdrope1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="airdrope2" {...register('airdrope')} value={SaleStatus.FINISHED} />
          <label className={styles.label} htmlFor="airdrope2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select white list state:</legend>
        <div>
          <input type="radio" id="whitelist0" {...register('whiteListSale')} value={SaleStatus.SOON} />
          <label className={styles.label} htmlFor="whitelist0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="whitelist1" {...register('whiteListSale')} value={SaleStatus.AVAILABLE} />
          <label className={styles.label} htmlFor="whitelist1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="whitelist2" {...register('whiteListSale')} value={SaleStatus.FINISHED} />
          <label className={styles.label} htmlFor="whitelist2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select public sale state:</legend>
        <div>
          <input type="radio" id="publicSale0" {...register('publicSale')} value={SaleStatus.SOON} />
          <label className={styles.label} htmlFor="publicSale0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="publicSale1" {...register('publicSale')} value={SaleStatus.AVAILABLE} />
          <label className={styles.label} htmlFor="publicSale1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="publicSale2" {...register('publicSale')} value={SaleStatus.FINISHED} />
          <label className={styles.label} htmlFor="publicSale2">
            Finished
          </label>
        </div>
      </fieldset>
      <FormButton type="submit" buttonText="Set sell stage" colorScheme="yellow" />
    </form>
  );
};
