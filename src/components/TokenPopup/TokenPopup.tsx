import { FC } from 'react';

import { tokens } from '@assets/constants';
import Close from '@assets/icons/close.svg';
import Search from '@assets/icons/search.svg';

import styles from './TokenPopup.module.css';

type Props = {
  onCLose: () => void;
};

export const TokenPopup: FC<Props> = ({ onCLose }) => {
  const allTokens = [...tokens, ...tokens, ...tokens];
  const firstTokensGroup = allTokens.splice(0, 7);

  return (
    <div className={styles.container}>
      <div className={styles.searchBlock}>
        <div className={styles.searchHead}>
          <p className={styles.searchTitle}>Select a token</p>
          <div className={styles.closePopup} onClick={onCLose}>
            <Close />
          </div>
        </div>
        <div className={styles.searchRow}>
          <div className={styles.searchIcon}>
            <Search />
          </div>
          <input className={styles.input} placeholder="Search asset or paste address" />
          <div className={styles.inputCLoseIcon}>
            <Close />
          </div>
        </div>
        <div className={styles.tokensRow}>
          {firstTokensGroup.map((item) => (
            <div className={styles.tokenItem}>
              <div className={styles.tokenIcon}>{item.icon}</div>
              <div className={styles.tokenSymbol}> {item.symbol}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.listBlock}>
        {allTokens.map((item) => (
          <div className={styles.listItem}>
            <div className={styles.tokenIcon}>{item.icon}</div>
            <div className={styles.tokenSymbol}> {item.symbol}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
