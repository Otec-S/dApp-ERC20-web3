import { FC } from 'react';

import CancelOffer from '@src/components/cancel-offer-popup/CancelOffer';

import Header from '../../components/header/Header';

export const ERC20send: FC = () => {
  return (
    <div style={{ background: '#FFEDBE' }}>
      <Header colorScheme="lightBackground" />
      <CancelOffer
        tokenFromName="MKR"
        tokenToName="WETH"
        amountFrom={16.56}
        amountTo={18.0}
        onClose={(data) => console.log(data)}
        tradeId={BigInt(15)}
      />
    </div>
  );
};
