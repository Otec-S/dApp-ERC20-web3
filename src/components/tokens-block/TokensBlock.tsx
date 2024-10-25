import { FC } from 'react';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useConnections } from 'wagmi';

import { useChainDependentValues } from '@shared/hooks';

import { TokenRow } from './token-row/TokenRow';
import classes from './TokensBlock.module.css';

export const TokensBlock: FC = () => {
  const connections = useConnections();
  const { tokens } = useChainDependentValues();
  const { chain } = useAccount();

  const isSuppurtedChain = chain?.id === polygonAmoy.id || chain?.id === sepolia.id;

  return (
    <div className={classes.tokenContainer}>
      {connections.length > 0 && isSuppurtedChain ? (
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
