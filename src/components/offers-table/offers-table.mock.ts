import { Address } from 'viem';

function createData(
  id: number,
  from: string,
  to: string,
  amount1: number,
  amount2: number,
  rate: number,
  hash: Address,
  status: 'Open' | 'For me',
  receiver: Address,
) {
  return { id, from, to, amount1, amount2, rate, hash, status, receiver };
}

export const rows = [
  createData(
    355157,
    'MKR',
    'WETH',
    1000.0,
    608000.21,
    608.21,
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    'Open',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  ),
];
