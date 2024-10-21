import { FC } from 'react';

import { AdminForm } from '@components/admin-form/AdminForm';
import Header from '@components/header/Header';

import styles from './Admin.module.css';

export const Admin: FC = () => {
  return (
    <div className={styles.admin}>
      <Header colorScheme="darkBackground" />
      <h1 className={styles.header}>Admin page</h1>
      <AdminForm />
    </div>
  );
};
