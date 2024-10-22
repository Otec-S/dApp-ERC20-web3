import { FC, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { Loader } from '@components/loader/Loader';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';
import { useProofDownload } from '@shared/hooks/useProofDownload';

import styles from '../NFTCollection.module.css';

const tokenId = [Math.floor(Math.random() * 1000)];

export const AirDrop: FC = () => {
  const { nftContractAddress } = useChainDependentValues();
  const { files, setTokenIds, loading: isImageLoading } = useFetchFiles();
  const { writeContract, error: mintError, data: hash } = useWriteContract({});
  const { address: walletAddress } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const {
    data,
    refetch,
    isLoading: isDataLoading,
    error: dataError,
  } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress
      ? [
          { abi: nftContractAbi, address: nftContractAddress, functionName: 'getMerkleProofs' },
          {
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'allowedToClaimDropAmount',
            args: [walletAddress],
          },
        ]
      : undefined,
  });

  const [proofsUri, allowedToClaimDropAmount] = data || [];
  const { file, loading: isFileLoading } = useProofDownload(proofsUri ?? '');
  const isInAirdropList = file?.airdrop.some((item) => item.address === walletAddress);

  const mintNft = useCallback(() => {
    const proof = file?.airdrop.find((item) => item.address === walletAddress)?.proof;

    if (proof && allowedToClaimDropAmount && allowedToClaimDropAmount > 0) {
      writeContract({
        abi: nftContractAbi,
        address: nftContractAddress,
        functionName: 'claimAirdrop',
        args: [proof, BigInt(allowedToClaimDropAmount)],
      });
    }
    if (Number(allowedToClaimDropAmount) === 0) {
      toast.error("you can't claim more tokens");
    }
  }, [allowedToClaimDropAmount, file?.airdrop, nftContractAddress, walletAddress, writeContract]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    const error = dataError || mintError;
    if (error) {
      toast(error.name);
    }
  }, [dataError, mintError]);

  useEffect(() => {
    setTokenIds(tokenId);
  }, [setTokenIds]);

  if (isLoading || isDataLoading || isFileLoading || isImageLoading) {
    return <Loader />;
  }

  return isInAirdropList ? (
    <div className={styles.content}>
      <h2 className={styles.title}>Congratulations!</h2>
      <div className={styles.contentRow}>
        <div className={styles.contentBlock}>
          <p className={styles.description}>Your wallet has been whitelisted! Claim your NFT now!</p>
          <button className={styles.mintButton} onClick={mintNft}>
            Claim NFT
          </button>
        </div>
        <div className={styles.imageGroup}>
          <div className={styles.contentImage}>
            <img className={styles.image} src={files?.[0]?.image ?? ''} alt="first token image"></img>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.content}>
      <h2 className={styles.title}>{'You’re not whitelisted yet :('}</h2>
      <div className={styles.contentRow}>
        <div className={styles.contentBlockFullWidth}>
          <p className={styles.description}>
            To participate in AirDrop please send us an information about your project
          </p>
          <button className={styles.mintButton} onClick={mintNft}>
            Get whitelisted
          </button>
        </div>
      </div>
    </div>
  );
};
