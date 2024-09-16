import React from 'react';
import { tokens } from '@src/assets/constants';
import { TokenRow } from '../TokenRow';
import classes from './TokensBlock.module.css';

export const TokensBlock: React.FC = () => {
  return (
    <div className={classes.tokenContainer}>
      {tokens.map((token) => (
        <TokenRow
          icon={token.icon}
          sepoliaAddress={token.sepoliaAddress}
          polygonAddress={token.polygonAddress}
          key={token.id}
        />
      ))}
    </div>
  );
};
