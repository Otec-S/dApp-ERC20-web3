import { ReactElement } from 'react';
import { Address } from 'viem';

export interface ITokens {
  id: number;
  name: string;
  address: Address;
  icon: ReactElement;
}
