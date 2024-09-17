import { Address } from 'viem';
import { getToken } from 'wagmi/actions';
import { config } from '../../wagmiConfig';

export const fetchGetToken = (address: Address) => async () => {
  return await getToken(config, { address });
};
