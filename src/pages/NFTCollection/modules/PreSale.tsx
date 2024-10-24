import { FC, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContracts,
  // useSignMessage,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { Loader } from '@components/loader/Loader';
import { MintingForm } from '@components/minting-form/MintingForm';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';
import { useProofDownload } from '@shared/hooks/useProofDownload';
import { getTotalCost } from '@shared/utils/getTotalCost';
// import { getTotalCost } from '@shared/utils/getTotalCost';

// FIXME: что это?
const tokenIds = Array.from(Array(10).keys()).map((item) => item + 1);

export const PreSale: FC = () => {
  const { nftContractAddress } = useChainDependentValues();

  const { files, setTokenIds, loading: isFetchingFileLoading } = useFetchFiles();
  const { writeContract, error: mintError, data: hash } = useWriteContract({});
  const { address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  // TODO: это вроде не используется
  // const { signMessage } = useSignMessage();

  const {
    data,
    refetch,
    isLoading: isDataLoading,
    error: dataError,
  } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress
      ? [
          // TODO: это вроде не используется
          // { abi: nftContractAbi, address: nftContractAddress, functionName: 'CAT' },
          { abi: nftContractAbi, address: nftContractAddress, functionName: 'getMerkleProofs' },
          {
            abi: nftContractAbi,
            address: nftContractAddress,
            // functionName: 'allowedToPublicMintAmount',
            functionName: 'allowedToWhiteListMintAmount',
            args: [walletAddress],
          },
          {
            abi: nftContractAbi,
            address: nftContractAddress,
            // functionName: 'publicSalePrice'
            functionName: 'whiteListSalePrice',
          },
        ]
      : undefined,
  });

  // const [cat, allowedToPublicMintAmount, salePrice] = data || [];
  const [proofsUri, allowedToWhiteListMintAmount, salePrice] = data || [];
  console.log('salePrice', salePrice);

  const { file, loading: isFileLoading } = useProofDownload(proofsUri ?? '');
  console.log('file', file);

  const isInWhiteList = file?.private.some((item) => item.address === walletAddress);

  const mintNft = useCallback(
    ({ amount }: { amount: number }) => {
      if (salePrice) {
        const proof = file?.private.find((item) => item.address === walletAddress)?.proof;
        // FIXME: тут остановился
        const totalCost = getTotalCost({ amount, price: Number(formatUnits(salePrice, 18)) });
        console.log('totalCost:', totalCost);

        if (proof && allowedToWhiteListMintAmount && allowedToWhiteListMintAmount > 0) {
          writeContract({
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'whitelistMint',
            args: [proof, BigInt(allowedToWhiteListMintAmount)],
            // TODO:
            // value: parseUnits(totalCost.toString(), 18),
            value: BigInt(totalCost),
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
      // TODO: что это?
      refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    console.log('dataError', dataError);
    console.log('mintError', mintError);
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

  // TODO:
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
  ) : null;
};
