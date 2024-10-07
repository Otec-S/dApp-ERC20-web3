import { FC } from 'react';
// import { Outlet } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';
import NewOfferForm from '@src/components/new-offer-form/NewOfferForm';
import { OffersTable } from '@src/components/offers-table/offers-table';
import EnhancedTable from '@src/components/offers-table/test-table';

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
        <Header colorScheme="lightBackground" />
      </div>
      {/* FIXME: */}
      {/* <NewOfferForm /> */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        <OffersTable />
        {/* <EnhancedTable /> */}
      </div>
    </div>
  );
};
