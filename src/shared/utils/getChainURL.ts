import { polygonAmoy, sepolia } from 'viem/chains';

import { POLYGON_AMOY_URL, SEPOLIA_URL } from '@shared/constants';

export const getChainURL = (id: number) => {
  switch (id) {
    case sepolia.id:
      return SEPOLIA_URL;
    case polygonAmoy.id:
      return POLYGON_AMOY_URL;
    default:
      return '';
  }
};
