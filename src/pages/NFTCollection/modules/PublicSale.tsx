import { FC, useCallback } from 'react';
import { formatUnits, toBytes } from 'viem';
import { useAccount, useBalance, useConfig, useReadContracts, useWriteContract } from 'wagmi';
import { signMessage } from 'wagmi/actions';

import { MintingForm } from '@components/minting-form/MintingForm';
import { nftContractAbi } from '@shared/constants';
import { useChainDependentValues, useFetchFiles } from '@shared/hooks';
export const PublicSale: FC = () => {
  const { nftContractAddress } = useChainDependentValues();
  const config = useConfig();
  const { files } = useFetchFiles();
  const { writeContract } = useWriteContract({});
  const { address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });

  const { data } = useReadContracts({
    allowFailure: false,
    contracts: [
      { abi: nftContractAbi, address: nftContractAddress, functionName: 'CAT' },
      { abi: nftContractAbi, address: nftContractAddress, functionName: 'MAX_PUBLIC_MINT' },
      { abi: nftContractAbi, address: nftContractAddress, functionName: 'publicSalePrice' },
    ],
  });

  const [cat, maxAmount, salePrice] = data || [];

  const mintNft = useCallback(
    async ({ amount }: { amount: number }) => {
      if (cat) {
        await signMessage(config, { message: { raw: toBytes(cat) } }).then((signature) => {
          console.log(signature);
          writeContract({
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: 'mint',
            args: [BigInt(amount), signature],
          });
        });
      }
    },
    [config, cat, nftContractAddress, writeContract],
  );

  return maxAmount && salePrice && balanceData ? (
    <MintingForm
      title={'Mint NFTs now!'}
      description={'You can mint up to 10 NFTs for the market price'}
      balance={Number(formatUnits(balanceData.value, balanceData.decimals))}
      price={Number(formatUnits(salePrice, 18))}
      maxAmount={Number(maxAmount)}
      files={files}
      onClick={mintNft}
    />
  ) : null;
};
