import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import { OffersTable } from '@src/components/offers-table/offers-table';

import styles from './ERC20trade.module.css';

export const ERC20trade: FC = () => {
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
      <Outlet />
      <div>
        <OffersTable />
      </div>
    </div>
  );
};
