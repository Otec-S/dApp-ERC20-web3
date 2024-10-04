import { ReactElement } from 'react';
import { Address } from 'viem';

import {
  ARBIcon,
  DAIIcon,
  DOGEIcon,
  LINKIcon,
  OPIcon,
  PEPEIcon,
  TRXIcon,
  USDCIcon,
  USDTIcon,
  WBTCIcon,
} from '@assets/icons';

export interface Token {
  id: number;
  name: string;
  sepoliaAddress: Address;
  polygonAddress: Address;
  icon: ReactElement;
  decimals: number;
}

export interface TokenData {
  requestWasSuccessful: boolean;
  tokenAddress?: Address;
  tokenName?: string;
  tokenDecimals?: number;
  tokenBalance?: bigint;
}

export const tokens: Token[] = [
  {
    id: 1,
    name: 'ARB',
    sepoliaAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    polygonAddress: '0x34cd8b477eb916c1c4224b2FFA80DE015cCC671b',
    icon: <ARBIcon />,
    decimals: 18,
  },
  {
    id: 2,
    name: 'DAI',
    sepoliaAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    polygonAddress: '0x1519d41F48F3621bCd583aa646C95217F87D3A99',
    icon: <DAIIcon />,
    decimals: 18,
  },
  {
    id: 3,
    name: 'DOGE',
    sepoliaAddress: '0xd409ffeb2f2e9dB0A75483a6417776CD6D7Ce774',
    polygonAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    icon: <DOGEIcon />,
    decimals: 18,
  },
  {
    id: 4,
    name: 'LINK',
    sepoliaAddress: '0x53BB015921600B6E4b373125B90143090F957d50',
    polygonAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    icon: <LINKIcon />,
    decimals: 18,
  },
  {
    id: 5,
    name: 'OP',
    sepoliaAddress: '0x54d412Fee228E13A42F38bC760faEFfDFE838536',
    polygonAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    icon: <OPIcon />,
    decimals: 18,
  },
  {
    id: 6,
    name: 'PEPE',
    sepoliaAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    polygonAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    icon: <PEPEIcon />,
    decimals: 18,
  },
  {
    id: 7,
    name: 'TRX',
    sepoliaAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    polygonAddress: '0xEe7356FB1362fD659D03892719d424Bd8D9D8f70',
    icon: <TRXIcon />,
    decimals: 18,
  },
  {
    id: 8,
    name: 'USDT',
    sepoliaAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    polygonAddress: '0x0a6DFA1eEf85B94E7e753bA222A6AcF2aE6C1a8b',
    icon: <USDTIcon />,
    decimals: 6,
  },
  {
    id: 9,
    name: 'USDC',
    sepoliaAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    polygonAddress: '0x6fD3B0bfB19Dc9C02f79E1e6E32444A390842700',
    icon: <USDCIcon />,
    decimals: 6,
  },
  {
    id: 10,
    name: 'WBTC',
    sepoliaAddress: '0x8805B377F0a28846198e81120179C4Ca5c6D5318',
    polygonAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    icon: <WBTCIcon />,
    decimals: 8,
  },
];
