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
  return <div className={styles.adminForm}>{saleManager && <AdminSaleForm />}</div>;
};
