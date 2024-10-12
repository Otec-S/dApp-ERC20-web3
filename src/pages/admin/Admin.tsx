import { FC } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount, useReadContract } from 'wagmi';

import { AdminForm } from '@components/admin-form/AdminForm';
import Header from '@components/header/Header';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './Admin.module.css';

export const Admin: FC = () => {
  const { isConnected, chainId } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const { data: roleConstant } = useReadContract({
    abi: nftContractAbi,
    address: nftContractAddress,
    functionName: 'PRICE_MANAGER_ROLE',
  });
  console.log(roleConstant);
  if (chainId === arbitrumSepolia.id) {
    return (
      <div className={styles.admin}>
        <Header colorScheme="darkBackground" />
        <main className={styles.main}>
          <h1 className={styles.header}>Admin page</h1>
          <AdminForm />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <Header colorScheme="darkBackground" />
      <main className={styles.main}>
        <h1 className={styles.header}>Please select arbitrum sepolia network</h1>
      </main>
    </div>
  );
};
