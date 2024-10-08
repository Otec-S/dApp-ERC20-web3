import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Address } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useChainId } from 'wagmi';

import { polygonContractAddress, sepoliaContractAddress, Token, tokens } from '../constants';

interface FormattedToken extends Omit<Token, 'polygonAddress' | 'sepoliaAddress'> {
  address: Address;
}

export interface ChainDependentValues {
  contractAddress: Address;
  tokens: FormattedToken[];
  website: string;
}

export const useChainDependentValues = (): ChainDependentValues => {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  switch (chainId) {
    case sepolia.id: {
      return {
        contractAddress: sepoliaContractAddress,
        tokens: tokens.map((item) => ({ ...item, address: item.sepoliaAddress })),
        website: 'sepolia.etherscan.io',
      };
    }
    case polygonAmoy.id: {
      return {
        contractAddress: polygonContractAddress,
        tokens: tokens.map((item) => ({ ...item, address: item.polygonAddress })),
        website: 'amoy.polygonscan.com',
      };
    }
    default:
      throw new Error('no such chain');
  }
};
