import { ChangeEvent, FC, useState } from 'react';

import { tokens } from '@assets/constants';
import Close from '@assets/icons/close.svg';
import Search from '@assets/icons/search.svg';

import styles from './TokenPopup.module.css';

type Props = {
  onCLose: () => void;
  onSelect: (symbol: string) => void;
};

export const TokenPopup: FC<Props> = ({ onCLose, onSelect }) => {
  const allTokens = [...tokens, ...tokens, ...tokens];

  const [searchText, setSearchText] = useState('');

  const tokenArr = allTokens.filter((item) => item.symbol.toLowerCase().includes(searchText.toLowerCase()));
  const firstTokensGroup = tokenArr.splice(0, 7);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectToken = (symbol: string) => () => {
    onSelect(symbol);
  };

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
          <input className={styles.input} placeholder="Search asset or paste address" onChange={handleChangeInput} />
          <div className={styles.inputCLoseIcon}>
            <Close />
          </div>
        </div>
        <div className={styles.tokensRow}>
          {firstTokensGroup.map((item) => (
            <div className={styles.tokenItem} onClick={handleSelectToken(item.symbol)}>
              <div className={styles.tokenIcon}>{item.icon}</div>
              <div className={styles.tokenSymbol}> {item.symbol}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.listBlock}>
        {tokenArr.map((item) => (
          <div className={styles.listItem} onClick={handleSelectToken(item.symbol)}>
            <div className={styles.tokenIcon}>{item.icon}</div>
            <div className={styles.tokenSymbol}> {item.symbol}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
