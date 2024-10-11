import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';

import styles from './ERC20trade.module.css';

export const Admin: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div className={styles.pageWrap}>
      <div className={styles.header}>
        <Header colorScheme="lightBackground" />
      </div>
    </div>
  );
};
