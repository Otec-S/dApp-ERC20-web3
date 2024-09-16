import React, { useCallback, useMemo } from 'react';
import PlusIcon from '@assets/icons/plus-icon.svg';
import { config, polygonId, sepoliaId } from '@src/assets/constants';
import { useMutation } from '@tanstack/react-query';
import { useChainId, useToken } from 'wagmi';
import { watchAsset } from 'wagmi/actions';
import { ITokenRow } from './TokenRow.interface';
import classes from './TokenRow.module.css';

export const TokenRow: React.FC<ITokenRow> = ({ icon, sepoliaAddress, polygonAddress }) => {
  const fetchAddToken = useMutation({
    mutationFn: async ({ address, symbol, decimals }: { address: string; symbol: string; decimals: number }) => {
      await watchAsset(config, {
        type: 'ERC20',
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
        },
      });
    },
  });

  const chainId = useChainId();
  const address = useMemo(() => {
    switch (chainId) {
      case sepoliaId: {
        return sepoliaAddress;
      }
      case polygonId: {
        return polygonAddress;
      }
      default: {
        throw new Error();
      }
    }
  }, [chainId, polygonAddress, sepoliaAddress]);

  const tokenData = useToken({ address }).data;

  const handleAddToken = useCallback(async () => {
    if (tokenData) {
      fetchAddToken.mutate({
        address: tokenData.address,
        symbol: tokenData.symbol ?? '',
        decimals: tokenData.decimals,
      });
    }
  }, [fetchAddToken, tokenData]);

  if (!tokenData) {
    return null;
  }

  return (
    <div className={classes.tokenRow}>
      <div>{icon}</div>
      <div className={classes.tokenText}>{tokenData.symbol}</div>
      <button className={classes.plusButton} onClick={handleAddToken}>
        <PlusIcon />
      </button>
    </div>
  );
};
