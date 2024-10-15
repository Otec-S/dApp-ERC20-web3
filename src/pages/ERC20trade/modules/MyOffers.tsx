import { FC } from 'react';

// import { OffersTable } from '@components/offers-table/Offers-table';
import { OffersTables } from '@components/offers-table/offers-tables';

export const MyOffers: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      <OffersTables />
    </div>
  );
};
