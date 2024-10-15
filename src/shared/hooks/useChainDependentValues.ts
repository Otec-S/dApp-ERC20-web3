import toast from 'react-hot-toast';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Address, zeroAddress } from 'viem';
import { arbitrumSepolia, polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useChainId } from 'wagmi';

import { nftContractAddress, polygonContractAddress, sepoliaContractAddress, Token, tokens } from '../constants';

interface FormattedToken extends Omit<Token, 'polygonAddress' | 'sepoliaAddress'> {
  address: Address;
}

export interface ChainDependentValues {
  contractAddress: Address;
  tokens: FormattedToken[];
  website: string;
  nftContractAddress: Address;
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
        nftContractAddress: zeroAddress,
      };
    }
    case polygonAmoy.id: {
      return {
        contractAddress: polygonContractAddress,
        tokens: tokens.map((item) => ({ ...item, address: item.polygonAddress })),
        website: 'amoy.polygonscan.com',
        nftContractAddress: zeroAddress,
      };
    }
    case arbitrumSepolia.id: {
      return {
        contractAddress: zeroAddress,
        tokens: tokens.map((item) => ({ ...item, address: zeroAddress })),
        website: 'sepolia.arbiscan.io',
        nftContractAddress: nftContractAddress,
      };
    }
    default: {
      toast.error('This chain is not supported, please select Sepolia or PolygonAmoy');
      return {
        contractAddress: zeroAddress,
        tokens: [],
        website: '',
        nftContractAddress: zeroAddress,
      };
    }
  }
};
