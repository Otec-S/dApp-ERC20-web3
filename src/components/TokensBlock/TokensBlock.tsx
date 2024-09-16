import React from 'react';
import { tokens } from '@src/assets/constants';
import { useConnections } from 'wagmi';
import { TokenRow } from '../TokenRow';
import classes from './TokensBlock.module.css';

export const TokensBlock: React.FC = () => {
  const connections = useConnections();

  console.log(connections);

  return (
    <div className={classes.tokenContainer}>
      {connections.length > 0 ? (
        tokens.map((token) => (
          <TokenRow
            icon={token.icon}
            sepoliaAddress={token.sepoliaAddress}
            polygonAddress={token.polygonAddress}
            key={token.id}
          />
        ))
      ) : (
        <h3>Connect to wallet</h3>
      )}
    </div>
  );
};
