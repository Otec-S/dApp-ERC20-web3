import { FC } from 'react';

import { OffersTable } from '@components/offers-table/Offers-table';

export const MyOffers: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      <OffersTable />
    </div>
  );
};
