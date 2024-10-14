import { useEffect, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { OfferReal } from '@components/offers-table/offers-tables.types';
import { tradeContractAbi } from '@shared/constants';

import { useChainDependentValues } from './useChainDependentValues';

export function useUserTrades(userAddress: Address): OfferReal[] {
  const { contractAddress, tokens } = useChainDependentValues();

  const [rowsReal, setRowsReal] = useState<OfferReal[]>([]);

  const { data, isError, error } = useReadContract({
    address: contractAddress,
    abi: tradeContractAbi,
    functionName: 'getUserTrades',
    args: [userAddress],
  });

  const { data: offersForMe } = useReadContract({
    address: contractAddress,
    abi: tradeContractAbi,
    functionName: 'getOptionalTakerTrades',
    args: [userAddress],
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching user trades:', error);
      return;
    }

    const newRowsReal: OfferReal[] = [];

    // Обработка данных из getUserTrades
    if (data) {
      console.log('data', data);
      const userTrades = data.map((offer) => {
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
          hash: zeroAddress,
          status: 'Open',
          receiver: offer.optionalTaker || '',
        };
      });
      newRowsReal.push(...userTrades);
    }

    // Обработка данных из getOptionalTakerTrades
    if (offersForMe) {
      console.log('offersForMe', offersForMe);
      const optionalTakerTrades = offersForMe.map((offer) => {
        const fromToken = tokens.find((token) => token.address === offer.tokenFrom);
        const toToken = tokens.find((token) => token.address === offer.tokenTo);

        return {
          id: Number(offer.tradeID), // Здесь предполагаем, что tradeID уникален
          fromTokenAddress: offer.tokenFrom,
          fromTokenName: fromToken ? fromToken.name : 'Unknown',
          toTokenAddress: offer.tokenTo,
          toTokenName: toToken ? toToken.name : 'Unknown',
          amount1: Number(formatUnits(offer.amountFrom, fromToken ? fromToken.decimals : 18)),
          amount2: Number(formatUnits(offer.amountTo, toToken ? toToken.decimals : 18)),
          rate: Number((Number(offer.amountFrom) / Number(offer.amountTo)).toFixed(2)),
          hash: zeroAddress,
          status: 'For me',
          receiver: offer.optionalTaker || '',
        };
      });
      newRowsReal.push(...optionalTakerTrades);
    }

    // Проверяем, изменился ли rowsReal
    if (JSON.stringify(newRowsReal) !== JSON.stringify(rowsReal)) {
      setRowsReal(newRowsReal);
    }
  }, [data, offersForMe, isError, error, userAddress, contractAddress, tokens]);

  return rowsReal;
}
