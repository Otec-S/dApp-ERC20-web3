import { FC } from 'react';

import Header from '@components/header/Header';
import { Tabs } from '@components/Tabs/Tabs';

export const ERC20trade: FC = () => {
  return (
    <div style={{ background: '#FFEDBE' }}>
      <Header colorScheme="lightBackground" />
      <Tabs />
    </div>
  );
};
