import { watchAsset } from 'wagmi/actions';
import { config } from '../../wagmiConfig';

export const fetchAddToken = async ({
  address,
  symbol,
  decimals,
}: {
  address: string;
  symbol: string;
  decimals: number;
}) => {
  await watchAsset(config, {
    type: 'ERC20',
    options: {
      address: address,
      symbol: symbol,
      decimals: decimals,
    },
  });
};
