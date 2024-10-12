import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount, useChainId } from 'wagmi';

import { AdminForm } from '@components/admin-form/AdminForm';
import Header from '@components/header/Header';

import styles from './Admin.module.css';

export const Admin: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }
  const chainId = useChainId();
  if (chainId === arbitrumSepolia.id) {
    return (
      <div className={styles.admin}>
        <Header colorScheme="darkBackground" />
        <main className={styles.main}>
          <h1 className={styles.header}>Admin page</h1>
          <AdminForm />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <Header colorScheme="darkBackground" />
      <main className={styles.main}>
        <h1 className={styles.header}>Please select arbitrum sepolia network</h1>
      </main>
    </div>
  );
};
