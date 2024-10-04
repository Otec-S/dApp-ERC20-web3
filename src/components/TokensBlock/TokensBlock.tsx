import { FC } from 'react';
import { useConnections } from 'wagmi';

import { useChainDependentValues } from '@src/shared/hooks';

import { TokenRow } from '../TokenRow/TokenRow';
import classes from './TokensBlock.module.css';

export const TokensBlock: FC = () => {
  const connections = useConnections();
  const { tokens } = useChainDependentValues();

  return (
    <div className={classes.tokenContainer}>
      {connections.length > 0 ? (
        tokens?.map((token) => (
          <TokenRow
            icon={token.icon}
            address={token.address}
            key={token.address}
            symbol={token.name}
            decimals={token.decimals}
          />
        ))
      ) : (
        <div className={classes.offerToConnectChain}>Connect to Sepolia or PolygonAmoy</div>
      )}
    </div>
  );
};
