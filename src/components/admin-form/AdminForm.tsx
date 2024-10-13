import { FC } from 'react';
import { useForm } from 'react-hook-form';

import FormButton from '@components/form-button/FormButton';

import { AdminSaleForm } from './AdminSaleForm';
import styles from './AdminForm.module.css';

interface Props {
  priceManager: boolean;
  saleManager: boolean;
  whiteListManager: boolean;
}

export const AdminForm: FC<Props> = ({ priceManager, saleManager, whiteListManager }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form className={styles.adminForm} onSubmit={handleSubmit(onSubmit)}>
      {saleManager && <AdminSaleForm />}
      <FormButton type="submit" buttonText="Submit all" colorScheme="yellow" />
    </form>
  );
};
