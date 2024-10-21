import { Address } from 'viem';

export interface OfferReal {
  id: number;
  fromTokenAddress: Address;
  fromTokenName: string;
  toTokenAddress: Address;
  toTokenName: string;
  amount1: number;
  amount2: number;
  rate: number;
  status: string;
  receiver: Address | string;
  tokenFromDecimals: string;
  tokenToDecimals: string;
}
