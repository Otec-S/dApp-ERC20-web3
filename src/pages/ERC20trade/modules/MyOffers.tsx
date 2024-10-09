import { FC } from 'react';

import { OffersTable } from '@components/offers-table/offers-table';

export const MyOffers: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      <OffersTable />
      {/* <EnhancedTable /> */}
    </div>
  );
};
