import { FC, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatUnits, parseUnits, toBytes } from 'viem';
import {
  useAccount,
  useBalance,
  useConfig,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { signMessage } from 'wagmi/actions';

import { Loader } from '@components/loader/Loader';
import { MintingForm } from '@components/minting-form/MintingForm';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';
import { getTotalCost } from '@shared/utils/getTotalCost';

const tokenIds = Array.from(Array(10).keys()).map((item) => item + 1);

export const PublicSale: FC = () => {
  const { nftContractAddress } = useChainDependentValues();
  const config = useConfig();
  const { files } = useFetchFiles({ tokenIds });
  const { writeContract, error, isError, data: hash } = useWriteContract({});
  const { address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data, refetch } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress
      ? [
          { abi: nftContractAbi, address: nftContractAddress, functionName: 'CAT' },
          {
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'allowedToPublicMintAmount',
            args: [walletAddress],
          },
          { abi: nftContractAbi, address: nftContractAddress, functionName: 'publicSalePrice' },
        ]
      : undefined,
  });

  const [cat, allowedToPublicMintAmount, salePrice] = data || [];

  const mintNft = useCallback(
    async ({ amount }: { amount: number }) => {
      if (cat && salePrice) {
        const totalCost = getTotalCost({ amount, price: Number(formatUnits(salePrice, 18)) });
        await signMessage(config, { message: { raw: toBytes(cat) } }).then((signature) => {
          writeContract({
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'mint',
            args: [BigInt(amount), signature],
            value: parseUnits(totalCost.toString(), 18),
          });
        });
      }
    },
    [cat, salePrice, config, writeContract, nftContractAddress],
  );

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
    if (isError) {
      toast.error(error.name);
    }
  }, [error, isError, isSuccess, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  return allowedToPublicMintAmount && salePrice && balanceData ? (
    <MintingForm
      title={'Mint NFTs now!'}
      description={'You can mint up to 10 NFTs for the market price'}
      balance={Number(formatUnits(balanceData.value, balanceData.decimals))}
      price={Number(formatUnits(salePrice, 18))}
      maxAmount={Number(allowedToPublicMintAmount)}
      files={files}
      onClick={mintNft}
    />
  ) : null;
};
