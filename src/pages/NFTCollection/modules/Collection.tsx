import { FC } from 'react';
import { useAccount, useReadContracts } from 'wagmi';

import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import styles from '../NFTCollection.module.css';

export const Collection: FC = () => {
  const { address: walletAddress } = useAccount();
  const { nftContractAddress } = useChainDependentValues();

  const { data } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress
      ? [{ abi: nftContractAbi, address: nftContractAddress, functionName: 'tokensOfOwner', args: [walletAddress] }]
      : undefined,
  });

  const [tokenIds] = data || [];

  return (
    <div>
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>Your minted NFT</h2>
        <div className={styles.collection}></div>
      </div>
    </div>
  );
};
