import { FC, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { Loader } from '@components/loader/Loader';
import { MintingForm } from '@components/minting-form/MintingForm';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';
import { useProofDownload } from '@shared/hooks/useProofDownload';

import styles from '../NFTCollection.module.css';

const tokenIds = Array.from(Array(10).keys()).map((item) => item + 1);

export const PreSale: FC = () => {
  const { nftContractAddress } = useChainDependentValues();

  const { files, setTokenIds, loading: isFetchingFileLoading } = useFetchFiles();
  const { writeContract, error: mintError, data: hash } = useWriteContract({});
  const { address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });
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
            functionName: 'allowedToWhiteListMintAmount',
            args: [walletAddress],
          },
          {
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'whiteListSalePrice',
          },
        ]
      : undefined,
  });

  const [proofsUri, allowedToWhiteListMintAmount, salePrice] = data || [];
  const { file, loading: isFileLoading } = useProofDownload(proofsUri ?? '');
  const isInWhiteList = file?.private.some((item) => item.address === walletAddress);

  const mintNft = useCallback(
    ({ amount }: { amount: number }) => {
      if (salePrice) {
        const proof = file?.private.find((item) => item.address === walletAddress)?.proof;
        const totalCost = BigInt(amount) * salePrice;

        if (proof && allowedToWhiteListMintAmount && allowedToWhiteListMintAmount > 0) {
          writeContract({
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'whitelistMint',
            args: [proof, BigInt(amount)],
            value: totalCost,
          });
        }
        if (Number(allowedToWhiteListMintAmount) === 0) {
          toast.error("you can't claim more tokens");
        }
      }
    },
    [salePrice, allowedToWhiteListMintAmount, file?.private, nftContractAddress, walletAddress, writeContract],
  );

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
    setTokenIds(tokenIds);
  }, [setTokenIds]);

  if (isLoading || isFileLoading || isDataLoading || isFetchingFileLoading) {
    return <Loader />;
  }

  return isInWhiteList && allowedToWhiteListMintAmount && salePrice && balanceData ? (
    <MintingForm
      title={'Be an early bird!'}
      description={'Choose the amount of tokens you want to buy and make a payment in ETH.'}
      balance={Number(formatUnits(balanceData.value, balanceData.decimals))}
      price={Number(formatUnits(salePrice, 18))}
      maxAmount={Number(allowedToWhiteListMintAmount)}
      files={files}
      onClick={mintNft}
    />
  ) : (
    <div className={styles.content}>
      <h2 className={styles.title}>{'You’re not whitelisted yet :('}</h2>
      <div className={styles.contentRow}>
        <div className={styles.contentBlockFullWidth}>
          <p className={styles.description}>
            To participate in PreSale please send us an information about your project
          </p>
          <button className={styles.mintButton}>Get whitelisted</button>
        </div>
      </div>
    </div>
  );
};
