import { useEffect, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { OfferReal } from '@components/offers-table/offers-tables.types';
import { tradeContractAbi } from '@shared/constants';

import { useChainDependentValues } from './useChainDependentValues';

export function useUserTrades(userAddress: Address): OfferReal[] {
  const { contractAddress, tokens } = useChainDependentValues();
  const [rowsReal, setRowsReal] = useState<OfferReal[]>([]);
  // console.log('rowsReal', rowsReal);

  const {
    data: userTradesData,
    isError,
    error,
  } = useReadContract({
    address: contractAddress,
    abi: tradeContractAbi,
    functionName: 'getUserTrades',
    args: [userAddress],
  });

  console.log('userTradesData', userTradesData);

  const { data: offersForMeData } = useReadContract({
    address: contractAddress,
    abi: tradeContractAbi,
    functionName: 'getOptionalTakerTrades',
    args: [userAddress],
  });

  console.log('offersForMeData', offersForMeData);

  const handleContractError = (error: unknown) => {
    if (error instanceof Error) {
      console.error('Error fetching user trades:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  };

  const parseTradeData = (tradeData: typeof userTradesData | typeof offersForMeData) => {
    // TODO:
    return tradeData && Array.isArray(tradeData)
      ? tradeData.map((offer) => {
          const fromToken = tokens.find((token) => token.address === offer.tokenFrom);
          const toToken = tokens.find((token) => token.address === offer.tokenTo);

          return {
            id: Number(offer.tradeID),
            fromTokenAddress: offer.tokenFrom,
            fromTokenName: fromToken ? fromToken.name : 'Unknown',
            toTokenAddress: offer.tokenTo,
            toTokenName: toToken ? toToken.name : 'Unknown',
            amount1: Number(formatUnits(offer.amountFrom, fromToken ? fromToken.decimals : 18)),
            amount2: Number(formatUnits(offer.amountTo, toToken ? toToken.decimals : 18)),
            rate: Number((Number(offer.amountFrom) / Number(offer.amountTo)).toFixed(2)),
            status: offer.active ? 'Open' : 'Cancelled',
            receiver: offer.optionalTaker !== zeroAddress ? offer.optionalTaker : 'Any',
          };
        })
      : [];
  };

  useEffect(() => {
    if (isError) {
      handleContractError(error);
      return;
    }

    // TODO: упростить тут как-то?
    const newRowsReal = [
      ...(userTradesData ? parseTradeData(userTradesData) : []),
      ...(offersForMeData ? parseTradeData(offersForMeData) : []),
    ];

    if (JSON.stringify(newRowsReal) !== JSON.stringify(rowsReal)) {
      setRowsReal(newRowsReal);
    }
  }, [userTradesData, offersForMeData, isError, error, userAddress, contractAddress, tokens, rowsReal]);

  return rowsReal;
}
