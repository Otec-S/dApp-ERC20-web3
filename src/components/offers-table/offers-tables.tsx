import { FC, useEffect, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { OfferReal } from '@components/offers-table/offers-tables.types';
import { tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks/useChainDependentValues';

import { OffersTable } from './offers-table';
import { OffersTableHistory } from './Offers-table-history';

export const OffersTables: FC = () => {
  // const { userAddress } = useAccount();
  // TODO: бери из соответствующего хука
  const userAddress: Address = '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054';
  const { contractAddress, tokens } = useChainDependentValues();
  const [rowsMyOffers, setRowsMyOffers] = useState<OfferReal[]>([]);
  console.log('rowsMyOffers', rowsMyOffers);
  const [rowsHistory, setRowsHistory] = useState<OfferReal[]>([]);
  // console.log('rowsHistory', rowsHistory);

  const {
    data: myOffersData,
    isError,
    error,
  } = useReadContract({
    address: contractAddress,
    abi: tradeContractAbi,
    functionName: 'getUserTrades',
    args: [userAddress],
  });

  console.log('myOffersData', myOffersData);

  // const { data: offersForMeData } = useReadContract({
  //   address: contractAddress,
  //   abi: tradeContractAbi,
  //   functionName: 'getOptionalTakerTrades',
  //   args: [userAddress],
  // });

  // console.log('offersForMeData', offersForMeData);

  // const { data: offer25 } = useReadContract({
  //   address: contractAddress,
  //   abi: tradeContractAbi,
  //   functionName: 'getOfferDetails',
  //   args: [BigInt(25)],
  // });

  // console.log('offer25', offer25);

  const handleContractError = (error: unknown) => {
    if (error instanceof Error) {
      console.error('Error fetching user trades:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  };

  const parseTradeData = (
    tradeData: typeof myOffersData,
    // | typeof offersForMeData
  ) => {
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
            // status: offer.active ? 'Open' : 'Cancelled',
            status: offer.optionalTaker === userAddress ? 'For me' : offer.active ? 'Open' : 'Cancelled',
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

    // const newRowsReal = [
    //   ...(myOffersData ? parseTradeData(myOffersData) : []),
    //   ...(offersForMeData ? parseTradeData(offersForMeData) : []),
    // ];

    // setRowsMyOffers(newRowsReal);

    // TODO: ранее это спасало от бесконечных перерендеров
    // if (JSON.stringify(newRowsReal) !== JSON.stringify(newRowsReal)) {
    //   setRowsMyOffers(newRowsReal);
    // }

    // Разбор только myOffersData по статусу
    const parsedMyOffers = myOffersData ? parseTradeData(myOffersData) : [];
    const activeMyOffers = parsedMyOffers.filter((offer) => offer.status !== 'Cancelled');
    const cancelledMyOffers = parsedMyOffers.filter((offer) => offer.status === 'Cancelled');

    // Для offersForMeData просто разбираем данные без фильтрации
    // const parsedOffersForMe = offersForMeData ? parseTradeData(offersForMeData) : [];

    // В rowsMyOffers попадают все активные из myOffersData и все из offersForMeData
    const newRowsMyOffers = [
      ...activeMyOffers,
      //  ...parsedOffersForMe
    ];
    setRowsMyOffers(newRowsMyOffers);

    // В rowsHistory попадают все отменённые из myOffersData
    setRowsHistory(cancelledMyOffers);

    // TODO: дополни массив зависимостей, но следи за перерендерами
  }, [
    myOffersData,
    // offersForMeData
  ]);

  return (
    <>
      <OffersTable rowsMyOffers={rowsMyOffers} />
      <OffersTableHistory rowsHistory={rowsHistory} />
    </>
  );
};
