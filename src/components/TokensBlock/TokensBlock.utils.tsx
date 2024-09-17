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
import { polygonAddress, polygonId, sepoliaAddress, sepoliaId } from './TokensBlock.constants';
import { ITokens } from './TokensBlock.interface';

export const getTokens = (chainId: number): ITokens[] =>
  [
    { id: 1, name: 'ARB', icon: <ARBIcon /> },
    { id: 2, name: 'DAI', icon: <DAIIcon /> },
    { id: 3, name: 'DOGE', icon: <DOGEIcon /> },
    { id: 4, name: 'LINK', icon: <LINKIcon /> },
    { id: 5, name: 'OP', icon: <OPIcon /> },
    { id: 6, name: 'PEPE', icon: <PEPEIcon /> },
    { id: 7, name: 'TRX', icon: <TRXIcon /> },
    { id: 8, name: 'USDT', icon: <USDTIcon /> },
    { id: 9, name: 'USDC', icon: <USDCIcon /> },
    { id: 10, name: 'WBTC', icon: <WBTSIcon /> },
  ].map((item) => {
    let address;
    switch (chainId) {
      case sepoliaId: {
        address = sepoliaAddress[item.name];
        break;
      }
      case polygonId: {
        address = polygonAddress[item.name];
        break;
      }
      default: {
        throw new Error();
      }
    }

    return { ...item, address };
  });
