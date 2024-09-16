import React, { useCallback, useMemo } from 'react';
import PlusIcon from '@assets/icons/plus-icon.svg';
import { polygonId, sepoliaId } from '@src/assets/constants';
import { fetchAddToken } from '@src/fetches/fetchAddToken';
import { useMutation } from '@tanstack/react-query';
import { useChainId, useToken } from 'wagmi';
import { ITokenRow } from './TokenRow.interface';
import classes from './TokenRow.module.css';

export const TokenRow: React.FC<ITokenRow> = ({ icon, sepoliaAddress, polygonAddress }) => {
  const addTokenMutation = useMutation({ mutationFn: fetchAddToken });
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

  const handleAddToken = useCallback(() => {
    if (tokenData) {
      addTokenMutation.mutate({
        address: tokenData.address,
        symbol: tokenData.symbol ?? '',
        decimals: tokenData.decimals,
      });
    }
  }, [addTokenMutation, tokenData]);

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
