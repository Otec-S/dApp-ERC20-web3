import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Header from '@components/header/Header';

export const Admin: FC = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  return (
    <div>
      <div>
        <Header colorScheme="darkBackground" />
      </div>
    </div>
  );
};
