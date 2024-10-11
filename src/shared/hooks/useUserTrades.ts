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

  useEffect(() => {
    if (isError) {
      console.error('Error fetching user trades:', error);
      return;
    }
    if (data) {
      const newRowsReal = data.map((offer) => {
        // Найдите fromTokenName и toTokenName по адресам
        const fromToken = tokens.find((token) => token.address === offer.tokenFrom);
        const toToken = tokens.find((token) => token.address === offer.tokenTo);

        return {
          id: Number(offer.tradeID),
          fromTokenAddress: offer.tokenFrom,
          fromTokenName: fromToken ? fromToken.name : 'Unknown',
          toTokenAddress: offer.tokenTo,
          toTokenName: toToken ? toToken.name : 'Unknown',
          amount1: Number(formatUnits(offer.amountFrom, fromToken ? fromToken.decimals : 18)), // Используйте децималы токена или по умолчанию 18
          amount2: Number(formatUnits(offer.amountTo, toToken ? toToken.decimals : 18)), // Используйте децималы токена или по умолчанию 18
          rate: Number(offer.amountFrom) / Number(offer.amountTo),
          hash: zeroAddress,
          status: offer.active ? 'Open' : offer.completed ? 'Accepted' : 'Cancelled',
          receiver: offer.optionalTaker || '',
        };
      });
      // setRowsReal(newRowsReal);
      // TODO: что это?
      if (JSON.stringify(newRowsReal) !== JSON.stringify(rowsReal)) {
        setRowsReal(newRowsReal);
      }
    }
  }, [data, isError, error, userAddress, contractAddress, tokens]);

  return rowsReal;
}
