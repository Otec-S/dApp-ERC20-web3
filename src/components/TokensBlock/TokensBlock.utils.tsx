import { ReactElement } from 'react';
import { Address } from 'viem/accounts';
import { polygonAmoy, sepolia } from 'viem/chains';

import ARBIcon from '@assets/icons/arb.svg';
import DAIIcon from '@assets/icons/dai.svg';
import DOGEIcon from '@assets/icons/doge.svg';
import LINKIcon from '@assets/icons/link.svg';
import OPIcon from '@assets/icons/op.svg';
import PEPEIcon from '@assets/icons/pepe.svg';
import TRXIcon from '@assets/icons/trx.svg';
import USDCIcon from '@assets/icons/usdc.svg';
import USDTIcon from '@assets/icons/usdt.svg';
import WBTSIcon from '@assets/icons/wbtc.svg';

import { polygonAddress, sepoliaAddress } from './TokensBlock.constants';

export type TokensType = {
  symbol: string;
  address: Address;
  icon: ReactElement;
  decimals: number;
};

export const getTokens = (chainId: number): TokensType[] =>
  [
    { symbol: 'ARB', icon: <ARBIcon />, decimals: 18 },
    { symbol: 'DAI', icon: <DAIIcon />, decimals: 18 },
    { symbol: 'DOGE', icon: <DOGEIcon />, decimals: 18 },
    { symbol: 'LINK', icon: <LINKIcon />, decimals: 18 },
    { symbol: 'OP', icon: <OPIcon />, decimals: 18 },
    { symbol: 'PEPE', icon: <PEPEIcon />, decimals: 18 },
    { symbol: 'TRX', icon: <TRXIcon />, decimals: 18 },
    { symbol: 'USDT', icon: <USDTIcon />, decimals: 6 },
    { symbol: 'USDC', icon: <USDCIcon />, decimals: 6 },
    { symbol: 'WBTC', icon: <WBTSIcon />, decimals: 8 },
  ].map((item) => {
    switch (chainId) {
      case sepolia.id: {
        return { ...item, address: sepoliaAddress[item.symbol] };
      }
      case polygonAmoy.id: {
        return { ...item, address: polygonAddress[item.symbol] };
      }
      default: {
        throw new Error();
      }
    }
  });
