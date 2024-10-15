import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useReadContracts } from 'wagmi';

import Header from '@components/header/Header';
import { ProgressBar } from '@components/progress-bar/ProgressBar';
import { SideMenu } from '@components/side-menu/SideMenu';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import styles from './NFTCollection.module.css';

export const NFTCollection: FC = () => {
  const { nftContractAddress } = useChainDependentValues();

  const { data } = useReadContracts({
    allowFailure: false,
    query: {
      refetchInterval: 10 * 1000,
    },
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'MAX_SUPPLY',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'totalSupply',
        abi: nftContractAbi,
      },
    ],
  });

  const [maxSupply, totalSupply] = data || [];

  return (
    <div className={styles.pageWrap}>
      <div>
        <Header colorScheme="darkBackground" />
      </div>
      <div className={styles.container}>
        <ProgressBar amount={totalSupply} maxAmount={maxSupply} />
        <div className={styles.pageRow}>
          <SideMenu />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
