import { CSSProperties, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount, useReadContracts } from 'wagmi';

import { AdminForm } from '@components/admin-form/AdminForm';
import Header from '@components/header/Header';
import { ROUTES } from '@shared/constants';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './Admin.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

export const Admin: FC = () => {
  const { isConnected, chainId, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const { data: constantsRoles, isLoading: isConstantsLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'PRICE_MANAGER_ROLE',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'SELL_PHASE_MANAGER_ROLE',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'WHITE_LIST_MANAGER_ROLE',
        abi: nftContractAbi,
      },
    ],
  });

  const PRICE_MANAGER_ROLE = constantsRoles && constantsRoles[0];
  const SELL_PHASE_MANAGER_ROLE = constantsRoles && constantsRoles[1];
  const WHITE_LIST_MANAGER_ROLE = constantsRoles && constantsRoles[2];

  const { data: rolesApproved, isLoading: isRolesApprovedLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: PRICE_MANAGER_ROLE && walletAddress && [PRICE_MANAGER_ROLE, walletAddress],
      },
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: SELL_PHASE_MANAGER_ROLE && walletAddress && [SELL_PHASE_MANAGER_ROLE, walletAddress],
      },
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: WHITE_LIST_MANAGER_ROLE && walletAddress && [WHITE_LIST_MANAGER_ROLE, walletAddress],
      },
    ],
  });

  const dataIsLoading = isRolesApprovedLoading || isConstantsLoading;

  if (dataIsLoading) {
    return (
      <div className={styles.loader}>
        <BeatLoader
          color={'red'}
          loading={true}
          cssOverride={override}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  } else {
    const userIsAllowedToSeeAdminPanel = rolesApproved && rolesApproved.some((role) => role === true);
    if (!userIsAllowedToSeeAdminPanel) {
      navigate(ROUTES.HOME);
    }
  }

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
