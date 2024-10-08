import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import { Tabs } from '@components/Tabs/Tabs';

import styles from './ERC20trade.module.css';
import { Outlet } from 'react-router-dom';

export const ERC20trade: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header colorScheme="lightBackground" />
      </div>
      <Tabs />
      <Outlet />
    </div>
  );
};
