import { useEffect, useState } from 'react';
import { Address, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { tradeContractAbi } from '@shared/constants';

import { Offer, OfferReal } from './offers-tables.types';

const userAddress: Address = '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054';
// const userAddressGalia: Address = '0x58ee5953d47C1dD226CcC18eeBc337Dee91f04dA';
const contractAddress: Address = '0x30bbAA44F7A80AfC9a5CB1aEEb8247B8E2aDE392';

function GetUserTradesAndSetRows() {
  const [rowsReal, setRowsReal] = useState<OfferReal[]>([]);

  // получаем все сделки пользователя
  const { data, isError, error } = useReadContract({
    address: contractAddress, // адрес контракта в соответствующей сети
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
      const newRowsReal = data.map((offer) => ({
        id: Number(offer.tradeID),
        fromTokenAddress: offer.tokenFrom,
        fromTokenName: 'пока нет',
        toTokenAddress: offer.tokenTo,
        toTokenName: 'пока нет',
        amount1: Number(offer.amountFrom),
        amount2: Number(offer.amountTo),
        rate: Number(offer.amountTo) / Number(offer.amountFrom),
        hash: zeroAddress,
        status: offer.active ? 'Open' : offer.completed ? 'Accepted' : 'Cancelled',
        receiver: offer.optionalTaker || '',
      }));
      setRowsReal(newRowsReal);
    }
  }, [data, isError, error, userAddress]);

  // Возвращаем null, так как мы не рендерим ничего в интерфейсе
  return null;
}

GetUserTradesAndSetRows();

//////////////////////////
//////////////////////////

export function createData(offer: Offer): Offer {
  return {
    ...offer,
    rate: parseFloat(offer.rate.toFixed(2)),
  };
}

export const rows: Offer[] = [
  createData({
    id: 355157,
    fromTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    fromTokenName: 'PEPE',
    toTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    toTokenName: 'DOGE',
    amount1: 1000.0,
    amount2: 608000.21,
    rate: 608.21,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Open',
    receiver: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }),
];
