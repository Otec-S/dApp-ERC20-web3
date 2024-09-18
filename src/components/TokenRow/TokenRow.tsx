import React, { ReactElement, useCallback } from 'react';

import PlusIcon from '@assets/icons/plus-icon.svg';
import { Address } from 'viem';
import { useConfig } from 'wagmi';
import { watchAsset } from 'wagmi/actions';

import classes from './TokenRow.module.css';

type Props = {
  icon: ReactElement;
  address: Address;
  symbol: string;
  decimals: number;
};

export const TokenRow: React.FC<Props> = ({ icon, address, symbol, decimals }) => {
  const config = useConfig();

  const handleAddToken = useCallback(async () => {
    await watchAsset(config, {
      type: 'ERC20',
      options: {
        address: address,
        symbol: symbol,
        decimals: decimals,
      },
    });
  }, [address, config, decimals, symbol]);

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
