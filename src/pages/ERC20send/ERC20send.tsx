import { FC } from 'react';

import CancelOffer from '@src/components/cancel-offer-popup/CancelOffer';

import Header from '../../components/header/Header';

export const ERC20send: FC = () => {
  return (
    <div style={{ background: '#FFEDBE' }}>
      <Header colorScheme="lightBackground" />
      <CancelOffer tradeId={BigInt(15)} />
    </div>
  );
};
