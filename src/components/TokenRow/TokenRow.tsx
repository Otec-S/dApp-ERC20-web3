import React, { useCallback } from 'react';
import PlusIcon from '@assets/icons/plus-icon.svg';
import { fetchAddToken } from '@src/fetches/fetchAddToken';
import { fetchGetToken } from '@src/fetches/fetchGetToken';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ITokenRow } from './TokenRow.interface';
import classes from './TokenRow.module.css';

export const TokenRow: React.FC<ITokenRow> = ({ icon, address }) => {
  const addTokenMutation = useMutation({ mutationFn: fetchAddToken });
  const { data } = useQuery({ queryKey: ['token'], queryFn: fetchGetToken(address) });

  const handleAddToken = useCallback(() => {
    if (data) {
      addTokenMutation.mutate({
        address: data.address,
        symbol: data.symbol ?? '',
        decimals: data.decimals,
      });
    }
  }, [addTokenMutation, data]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.tokenRow}>
      <div>{icon}</div>
      <div className={classes.tokenText}>{data.symbol}</div>
      <button className={classes.plusButton} onClick={handleAddToken}>
        <PlusIcon />
      </button>
    </div>
  );
};
