import { FC, ReactElement } from 'react';
import { Address } from 'viem';
import { useWatchAsset } from 'wagmi';

import PlusIcon from '@assets/icons/plus-icon.svg';

import classes from './TokenRow.module.css';

type Props = {
  icon: ReactElement;
  address: Address;
  symbol: string;
  decimals: number;
};

export const TokenRow: FC<Props> = ({ icon, address, symbol, decimals }) => {
  const { watchAsset } = useWatchAsset();

  const handleAddToken = () => {
    watchAsset({
      type: 'ERC20',
      options: {
        address: address,
        symbol: symbol,
        decimals: decimals,
      },
    });
  };

  return (
    <div className={classes.tokenRow}>
      <div>{icon}</div>
      <div className={classes.tokenText}>{symbol}</div>
      <button className={classes.plusButton} onClick={handleAddToken}>
        <PlusIcon />
      </button>
    </div>
  );
};
