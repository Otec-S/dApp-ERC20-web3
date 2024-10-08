import { FC } from 'react';

import { IncomingOfferForm } from '@components/incoming-offer-form/IncomingOfferForm';

import styles from '../ERC20trade.module.css';

export const IncomingOffer: FC = () => {
  return (
    <div className={styles.formContent}>
      <IncomingOfferForm />
    </div>
  );
};
