import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';

import styles from './Admin.module.css';

export const Admin: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.admin}>
      <Header colorScheme="darkBackground" />
      <main className={styles.main}>
        <h1 className={styles.header}>Admin page</h1>
      </main>
    </div>
  );
};
