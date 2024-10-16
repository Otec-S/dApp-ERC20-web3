import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount, useReadContracts } from 'wagmi';

import FormButton from '@components/form-button/FormButton';
import { Loader } from '@components/loader/Loader';
import { ROUTES } from '@shared/constants';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import { AdminSaleForm } from './AdminSaleForm';
import { AdminWhiteListForm } from './AdminWhiteListForm';
import styles from './AdminForm.module.css';

export const AdminForm: FC = () => {
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

  const SELL_PHASE_MANAGER_ROLE_DESCRIPTOR = constantsRoles && constantsRoles[0];
  const WHITE_LIST_MANAGER_ROLE_DESCRIPTOR = constantsRoles && constantsRoles[1];

  const { data: roles, isLoading: isRolesApprovedLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args:
          walletAddress && SELL_PHASE_MANAGER_ROLE_DESCRIPTOR
            ? [SELL_PHASE_MANAGER_ROLE_DESCRIPTOR, walletAddress]
            : undefined,
      },
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args:
          walletAddress && WHITE_LIST_MANAGER_ROLE_DESCRIPTOR
            ? [WHITE_LIST_MANAGER_ROLE_DESCRIPTOR, walletAddress]
            : undefined,
      },
    ],
  });

  const isUserSaleManager = roles && roles[0];
  const isUserWhiteListManager = roles && roles[1];

  const dataIsLoading = isRolesApprovedLoading || isConstantsLoading;

  if (dataIsLoading) return <Loader/>

  const isUserAllowedToPassAdminPanel = roles && roles.some((role) => role === true);

  if (!isUserAllowedToPassAdminPanel) {
    return (
      <section className={styles.main}>
        <h2 className={styles.header}>You are not allowed to admin panel</h2>
        <h3 className={styles.subheader}>Please check your rights and chain settings(Arbitrum Sepolia)</h3>
        <div className={styles.backButton}>
          <FormButton colorScheme="yellow" buttonText="Back" onPointerDown={() => navigate(ROUTES.HOME)} />
        </div>
      </section>
    );
  }

  if (chainId === arbitrumSepolia.id) {
    return (
      <section className={styles.main}>
        <h2 className={styles.header}>Admin form</h2>
        {isUserSaleManager && (
          <div className={styles.adminForm}>
            <AdminSaleForm />
          </div>
        )}
        {isUserWhiteListManager && (
          <div className={styles.adminForm}>
            <AdminWhiteListForm />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={styles.main}>
      <h2 className={styles.header}>Please select arbitrum sepolia network</h2>
    </section>
  );
};
