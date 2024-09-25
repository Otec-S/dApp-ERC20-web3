import { FC } from 'react';

import Header from '@src/components/header/Header';
import NewOfferForm from '@src/components/new-offer-form/NewOfferForm';

export const ERC20trade: FC = () => {
  return (
    <div style={{ background: '#FFEDBE' }}>
      <Header colorScheme="lightBackground" />
      <NewOfferForm />
    </div>
  );
};
