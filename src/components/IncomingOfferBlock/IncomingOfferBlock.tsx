import { FC, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';

import { tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import { IncomingOfferForm } from './IncomingOfferForm/IncomingOfferForm';
import { SuccessDialog } from './SuccessDialog/SuccessDialog';
import styles from './IncomingOfferBlock.module.css';

export const IncomingOfferBlock: FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { openConnectModal } = useConnectModal();
  const { address: walletAddress, isConnected } = useAccount();
  const { contractAddress } = useChainDependentValues();

  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  console.log(searchParams, matchPath('/:category', location.pathname));
  const tradeId = searchParams.get('id') as unknown as bigint;

  const {
    writeContract: acceptTrade,
    data: acceptedTradeHash,
    isPending: isAcceptPending,
    error: acceptError,
    isSuccess: isAcceptSuccess,
  } = useWriteContract();

  const {
    data: offerData,
    isPending: isOfferDataPending,
    error: offerDataError,
  } = useReadContract({
    abi: tradeContractAbi,
    address: contractAddress,
    functionName: 'getOfferDetails',
    args: [tradeId],
    query: { refetchInterval: 60000 },
  });

  const [tokenFrom, tokenTo, amountFrom, amountTo, , , , , completed] = offerData || [];

  const {
    data: tokensData,
    isPending: isTokenInfoPending,
    error: tokenInfoError,
  } = useReadContracts({
    allowFailure: false,
    contracts: tokenFrom &&
      tokenTo &&
      walletAddress && [
        { abi: erc20Abi, address: tokenFrom, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenFrom, functionName: 'name' },
        { abi: erc20Abi, address: tokenTo, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenTo, functionName: 'name' },
        { abi: erc20Abi, address: tokenTo, functionName: 'allowance', args: [walletAddress, contractAddress] },
      ],
  });

  const [tokenFromDecimals, tokenFromName, tokenToDecimals, tokenToName, allowance] = tokensData || [];

  useEffect(() => {
    const error = offerDataError || acceptError || tokenInfoError;
    if (error) {
      toast.error(error.name);
    }
  }, [acceptError, offerDataError, tokenInfoError]);

  if (isOfferDataPending || isAcceptPending || isTokenInfoPending) return <BarLoader />;

  const amountFromFormatted = Number(amountFrom && tokenFromDecimals && formatUnits(amountFrom, tokenFromDecimals));
  const amountToFormatted = Number(amountTo && tokenToDecimals && formatUnits(amountTo, tokenToDecimals));
  const rate = Number(amountFromFormatted && amountToFormatted && (amountToFormatted / amountFromFormatted).toFixed(2));

  const handleAcceptTrade = () => {
    acceptTrade({
      abi: tradeContractAbi,
      address: contractAddress,
      functionName: 'take',
      args: [tradeId],
    });
  };

  return (
    <>
      {tokenFromName && tokenToName && (
        <form>
          <div className={styles.container}>
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>
                {completed && isAcceptSuccess ? 'Offer has been successfully accepted!' : `Offer ID ${tradeId}`}
              </h3>
            </div>
            {completed && isAcceptSuccess ? (
              <SuccessDialog
                acceptedTradeHash={acceptedTradeHash}
                amountFromFormatted={amountFromFormatted}
                amountToFormatted={amountToFormatted}
                tokenFromName={tokenFromName}
                tokenToName={tokenToName}
                rate={rate}
              />
            ) : (
              <IncomingOfferForm
                amountFromFormatted={amountFromFormatted}
                amountToFormatted={amountToFormatted}
                tokenFromName={tokenFromName}
                tokenToName={tokenToName}
                rate={rate}
                allowance={allowance}
                onAcceptTrade={handleAcceptTrade}
              />
            )}
          </div>
        </form>
      )}
      <Toaster />
    </>
  );
};
