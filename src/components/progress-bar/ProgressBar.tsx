import { FC } from 'react';

import styles from './ProgressBar.module.css';

interface Props {
  amount?: bigint;
  maxAmount?: bigint;
}

export const ProgressBar: FC<Props> = ({ amount = 0, maxAmount = 100 }) => {
  const width = Math.ceil((Number(amount) * 100) / Number(maxAmount));
  const borderRadius = width > 99 ? '100px' : '100px 0px 0px 100px';

  return (
    <div className={styles.progressBar}>
      <div className={styles.completed} style={{ width: `${width}%`, borderRadius }}></div>
      <p className={styles.text}>{`${amount}/${maxAmount} NFT are already minted`}</p>
    </div>
  );
};
