import React from 'react';
import { useChainId, useConnections } from 'wagmi';
import { TokenRow } from '../TokenRow';
import { getTokens } from './TokensBlock.utils';
import classes from './TokensBlock.module.css';

export const TokensBlock: React.FC = () => {
  const connections = useConnections();
  const chainId = useChainId();
  const tokens = getTokens(chainId);

  return (
    <div className={classes.tokenContainer}>
      {connections.length > 0 ? (
        tokens.map((token) => <TokenRow icon={token.icon} address={token.address} key={token.id} />)
      ) : (
        <h3>Connect to wallet</h3>
      )}
    </div>
  );
};
