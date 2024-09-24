import { FC } from 'react';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import { IncomingOfferBlock } from '@components/IncomingOfferBlock/IncomingOfferBlock';

import styles from './OfferPage.module.css';

export const OfferPage: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      {isConnected ? <IncomingOfferBlock /> : <p>Connect!</p>}
    </div>
  );
};
