import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import { IncomingOfferBlock } from '@components/IncomingOfferBlock/IncomingOfferBlock';

import styles from './OfferPage.module.css';

export const OfferPage: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <IncomingOfferBlock />
    </div>
  );
};
