import { CSSProperties, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'viem/chains';
import { useAccount, useReadContracts } from 'wagmi';

import FormButton from '@components/form-button/FormButton';
import { ROUTES } from '@shared/constants';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import { AdminSaleForm } from './AdminSaleForm';
import { AdminWhiteListForm } from './AdminWhiteListForm';
import styles from './AdminForm.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

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

  const PRICE_MANAGER_ROLE_DESCRIPTOR = constantsRoles && constantsRoles[0];
  const SELL_PHASE_MANAGER_ROLE_DESCRIPTOR = constantsRoles && constantsRoles[1];
  const WHITE_LIST_MANAGER_ROLE_DESCRIPTOR = constantsRoles && constantsRoles[2];

  const { data: roles, isLoading: isRolesApprovedLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: PRICE_MANAGER_ROLE_DESCRIPTOR && walletAddress && [PRICE_MANAGER_ROLE_DESCRIPTOR, walletAddress],
      },
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: SELL_PHASE_MANAGER_ROLE_DESCRIPTOR &&
          walletAddress && [SELL_PHASE_MANAGER_ROLE_DESCRIPTOR, walletAddress],
      },
      {
        address: nftContractAddress,
        functionName: 'hasRole',
        abi: nftContractAbi,
        args: WHITE_LIST_MANAGER_ROLE_DESCRIPTOR &&
          walletAddress && [WHITE_LIST_MANAGER_ROLE_DESCRIPTOR, walletAddress],
      },
    ],
  });

  // const isUserPriceManager=roles && roles[0];
  const isUserSaleManager = roles && roles[1];
  const isUserWhiteListManager= roles && roles[2];

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
  }

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
        {isUserSaleManager && <div className={styles.adminForm}><AdminSaleForm /></div>}
        {isUserWhiteListManager && <div className={styles.adminForm}><AdminWhiteListForm /></div>}
      </section>
    );
  }

  return (
    <section className={styles.main}>
      <h2 className={styles.header}>Please select arbitrum sepolia network</h2>
    </section>
  );
};
