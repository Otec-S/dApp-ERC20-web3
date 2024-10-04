import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Hash } from 'viem';

import { ArrowRightIcon, NewWindowIcon, SuccessIcon } from '@assets/icons';
import { useChainDependentValues } from '@shared/hooks';

import styles from './SuccessDialog.module.css';

interface Props {
  acceptedTradeHash: Hash;
  amountFromFormatted: number;
  amountToFormatted: number;
  tokenFromName: string;
  tokenToName: string;
  rate: number;
}

export const SuccessDialog: FC<Props> = ({
  acceptedTradeHash,
  amountFromFormatted,
  amountToFormatted,
  tokenFromName,
  tokenToName,
  rate,
}) => {
  const { website } = useChainDependentValues();

  return (
    <div className={styles.successContainer}>
      <SuccessIcon />
      <div className={styles.successInfoRow}>
        <p className={styles.infoText}>{amountFromFormatted}</p>
        <p className={styles.infoText}>{tokenFromName}</p>
        <div className={styles.arrowBox}>
          <ArrowRightIcon />
        </div>
        <p className={styles.infoText}>{amountToFormatted}</p>
        <p className={styles.infoText}>{tokenToName}</p>
        <p className={styles.infoText}>Rate</p>
        <p className={styles.infoText}>{rate}</p>
      </div>
      {acceptedTradeHash && (
        <Link to={`https://${website}/tx/${acceptedTradeHash}`} target="_blank">
          <div className={styles.newWindowButton}>
            View transaction <NewWindowIcon />
          </div>
        </Link>
      )}
      <Link to="/" className={styles.greatButton}>
        Great!
      </Link>
    </div>
  );
};
