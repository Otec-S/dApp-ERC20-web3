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
  status: 'Open' | 'For me' | 'Cancelled' | 'Accepted';
  receiver: string;
  tokenFromDecimals: string;
  tokenToDecimals: string;
}
