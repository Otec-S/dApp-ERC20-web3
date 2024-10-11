import { useForm } from 'react-hook-form';
import { Address } from 'viem';

import FormButton from '@components/form-button/FormButton';

import styles from './AdminForm.module.css';

interface FormData {
  user:Address;
}

export const AdminForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = (data:FormData) => console.log(data);

  return (
    <form className={styles.adminForm} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.labelAddress}>
        Input user address
        <input className={styles.inputAddress} {...register("user", { required: true })} />
        {errors.user && <span className={styles.error}>This field is required</span>}
      </label>
      <fieldset className={styles.roles}>
  <legend>Choose roles to grand:</legend>
    <label className={styles.rolesLabel}>SELL_PHASE_MANAGER_ROLE
      <input type="checkbox" name="sell" />
    </label>
    <label className={styles.rolesLabel}>WHITE_LIST_MANAGER_ROLE
      <input type="checkbox"  name="white" />
    </label>
    <label className={styles.rolesLabel}>PRICE_MANAGER_ROLE
      <input type="checkbox" name="price" />
    </label>
</fieldset>

      <FormButton type='submit' buttonText='Grant role' colorScheme='yellow'/>
    </form>
  );
}