import { FC, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';

import { EthLogoIcon } from '@assets/icons';
import { Loader } from '@components/loader/Loader';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';

import styles from '../NFTCollection.module.css';

export const Collection: FC = () => {
  const { address: walletAddress } = useAccount();
  const { nftContractAddress } = useChainDependentValues();
  const { files, setTokenIds } = useFetchFiles();

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress
      ? [{ abi: nftContractAbi, address: nftContractAddress, functionName: 'tokensOfOwner', args: [walletAddress] }]
      : undefined,
  });

  const [tokenIds] = data || [];

  useEffect(() => {
    setTokenIds(tokenIds ? tokenIds.map((item) => Number(item)) : []);
  }, [setTokenIds, tokenIds]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>Your minted NFT</h2>
      </div>
      <div className={styles.collection}>
        {files.map((file) => (
          <div className={styles.contentImage}>
            <div className={styles.imageWrap}>
              <img className={styles.image} src={file.image}></img>
            </div>
            <div className={styles.imageInfo}>
              <p className={styles.imageInfoText}>{file.name}</p>
              <div className={styles.imageInfoCost}>
                <p className={styles.imageInfoText}>ETH</p>
                <EthLogoIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
