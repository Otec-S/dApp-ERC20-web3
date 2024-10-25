import { FC, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useChainModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import { ROUTES } from '@shared/constants';

const ArbitrumCheck: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chain } = useAccount();
  const navigate = useNavigate();
  const { openChainModal } = useChainModal();

  useEffect(() => {
    if (chain?.id !== arbitrumSepolia.id) {
      toast.error('Please connect to Arbitrum network to access this page.');
      navigate(ROUTES.HOME);

      setTimeout(() => {
        if (openChainModal) {
          openChainModal();
        }
      }, 3000);
    }
  }, [chain, navigate, openChainModal]);

  if (chain?.id !== arbitrumSepolia.id) {
    return null;
  }

  return <>{children}</>;
};

export default ArbitrumCheck;
