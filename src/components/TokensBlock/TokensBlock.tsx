import React from 'react';
import { useChainId, useConnections } from 'wagmi';
import { TokenRow } from '../TokenRow';
import { polygonId, sepoliaId } from './TokensBlock.constants';
import { getTokens } from './TokensBlock.utils';
import classes from './TokensBlock.module.css';

export const TokensBlock: React.FC = () => {
  const connections = useConnections();
  const chainId = useChainId();
  const isExistChain = chainId === sepoliaId || chainId === polygonId;
  const tokens = isExistChain ? getTokens(chainId) : null;

  return (
    <div className={classes.tokenContainer}>
      {connections.length > 0 ? (
        tokens?.map((token) => <TokenRow icon={token.icon} address={token.address} key={token.id} />)
      ) : (
        <h3>Connect to Sepolia or PolygonAmoy</h3>
      )}
    </div>
  );
};
