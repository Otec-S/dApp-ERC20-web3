import { FC } from 'react';
import { Address } from 'viem';

import { NotFoundIcon } from '@assets/icons';
import { useChainDependentValues } from '@shared/hooks';

import styles from './IncomingOfferToken.module.css';

interface Props {
  text: string;
  address?: Address;
  amount?: number;
  symbol?: string;
}

export const IncomingOfferToken: FC<Props> = ({ address, amount, text, symbol }) => {
  const { tokens } = useChainDependentValues();

  const icon = tokens?.find((item) => item.address === address)?.icon ?? <NotFoundIcon />;

  return (
    <div className={styles.infoBox}>
      <div className={styles.tokenBoxIcon}>{icon}</div>
      <div className={styles.infoCol}>
        <p className={styles.infoText}>{amount}</p>
        <p className={styles.infoDescription}>
          {text} {symbol}
        </p>
      </div>
    </div>
  );
};
