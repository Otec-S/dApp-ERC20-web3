import { Address } from 'viem';

export interface Offer {
  id: number;
  fromTokenAddress: Address;
  fromTokenName: string;
  toTokenAddress: Address;
  toTokenName: string;
  amount1: number;
  amount2: number;
  rate: number;
  hash: Address;
  status: 'Open' | 'For me' | 'Cancelled' | 'Accepted';
  receiver: Address;
}

export interface OfferReal {
  id: number;
  fromTokenAddress: Address;
  fromTokenName: string;
  toTokenAddress: Address;
  toTokenName: string;
  amount1: number;
  amount2: number;
  rate: number;
  hash: Address;
  // status: 'Open' | 'For me' | 'Cancelled' | 'Accepted';
  status: string;
  receiver: Address;
}
