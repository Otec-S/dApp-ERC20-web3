import { FC } from 'react';

import NewOfferForm from '@components/new-offer-form/NewOfferForm';

import styles from '../ERC20trade.module.css';

export const CreateOffer: FC = () => {
  return (
    <div className={styles.formContent}>
      <NewOfferForm />
    </div>
  );
};
