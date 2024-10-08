import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import { Tabs } from '@components/tabs/Tabs';

import styles from './ERC20trade.module.css';

export const ERC20trade: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.pageWrap}>
      <div className={styles.header}>
        <Header colorScheme="lightBackground" />
        <Tabs />
      </div>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};
