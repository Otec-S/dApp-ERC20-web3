import { polygonAmoy, sepolia } from 'viem/chains';
import { useChainId } from 'wagmi';

import { polygonContractAddress, sepoliaContractAddress, tokens } from '@shared/constants';

export const useChainDependentValues = () => {
  const chainId = useChainId();

  switch (chainId) {
    case sepolia.id: {
      return {
        contractAddress: sepoliaContractAddress,
        tokens: tokens.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { polygonAddress, sepoliaAddress, ...token } = { ...item, address: item.sepoliaAddress };
          return token;
        }),
        website: 'sepolia.etherscan.io/',
      };
    }
    case polygonAmoy.id: {
      return {
        contractAddress: polygonContractAddress,
        tokens: tokens.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { polygonAddress, sepoliaAddress, ...token } = { ...item, address: item.polygonAddress };
          return token;
        }),
        website: 'amoy.polygonscan.com',
      };
    }
    default:
      throw new Error('no such chain');
  }
};
