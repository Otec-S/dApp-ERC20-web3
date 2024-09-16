import { ReactElement } from 'react';

export interface ITokens {
  id: number;
  name: string;
  sepoliaAddress: `0x${string}`;
  polygonAddress: `0x${string}`;
  icon: ReactElement;
}
