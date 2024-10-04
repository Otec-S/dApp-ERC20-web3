import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';

import styles from './ERC20trade.module.css';
import { Tabs } from '@components/Tabs/Tabs';

export const ERC20trade: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.pageWrap}>
      <Header colorScheme="lightBackground" />
      <Tabs />
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};
