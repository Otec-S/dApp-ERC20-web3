import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@components/header/Header';
import { Tabs } from '@components/Tabs/Tabs';

import styles from './ERC20trade.module.css';

export const ERC20trade: FC = () => {
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
