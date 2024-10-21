import { useEffect, useState } from 'react';
import { formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { OfferReal } from '@components/offers-table/offers-tables.types';
import { tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks/useChainDependentValues';

export const useUserTrades = () => {
  const { address: walletAddress } = useAccount();
  const { contractAddress, tokens } = useChainDependentValues();
  const [rowsMyOffers, setRowsMyOffers] = useState<OfferReal[]>([]);
  const [rowsHistory, setRowsHistory] = useState<OfferReal[]>([]);

  const {
    data: myOffersData,
    isError,
    error,
  } = useReadContract(
    walletAddress
      ? {
          address: contractAddress,
          abi: tradeContractAbi,
          functionName: 'getUserTrades',
          args: [walletAddress],
        }
      : undefined,
  );

  // console.log('myOffersData', myOffersData);

  const { data: offersForMeData } = useReadContract(
    walletAddress
      ? {
          address: contractAddress,
          abi: tradeContractAbi,
          functionName: 'getOptionalTakerTrades',
          args: [walletAddress],
        }
      : undefined,
  );

  const handleContractError = (error: unknown) => {
    if (error instanceof Error) {
      console.error('Error fetching user trades:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  };

  const parseTradeData = (tradeData: typeof myOffersData | typeof offersForMeData) => {
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
            // TODO:
            tokenFromDecimals: (fromToken ? fromToken.decimals : 18).toString(),
            tokenToDecimals: (toToken ? toToken.decimals : 18).toString(),
            amount1: Number(formatUnits(offer.amountFrom, fromToken ? fromToken.decimals : 18)),
            amount2: Number(formatUnits(offer.amountTo, toToken ? toToken.decimals : 18)),
            rate: Number((Number(offer.amountFrom) / Number(offer.amountTo)).toFixed(2)),
            status:
              offer.optionalTaker === walletAddress && offer.completed
                ? 'Accepted'
                : offer.optionalTaker === walletAddress
                  ? 'For me'
                  : offer.active
                    ? 'Open'
                    : 'Cancelled',
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

    // Разбор myOffersData по статусу
    const parsedMyOffers = myOffersData ? parseTradeData(myOffersData) : [];
    const cancelledMyOffers = parsedMyOffers.filter((offer) => offer.status === 'Cancelled');
    const acceptedOffersForMe = parsedMyOffers.filter((offer) => offer.status === 'Accepted');

    // Получить массив id из parsedMyOffers
    const myOfferIds = parsedMyOffers.map((offer) => offer.id);

    // Разбор offersForMeData по статусу
    const parsedOffersForMe = offersForMeData ? parseTradeData(offersForMeData) : [];
    // убираем задвоение отображения принятых офферов For me
    const filteredOffersForMe = parsedOffersForMe.filter((offer) => !myOfferIds.includes(offer.id));

    const activeMyOffers = parsedMyOffers.filter(
      (offer) => offer.status !== 'Cancelled' && offer.status !== 'Accepted',
    );

    // В rowsMyOffers попадают все активные из myOffersData и все из offersForMeData
    const newRowsMyOffers = [...activeMyOffers, ...filteredOffersForMe];
    setRowsMyOffers(newRowsMyOffers);

    // аналогично для rowsHistory
    const newRowsHistory = [...cancelledMyOffers, ...acceptedOffersForMe];
    setRowsHistory(newRowsHistory);
  }, [myOffersData, offersForMeData]);

  return { rowsMyOffers, rowsHistory };
};
