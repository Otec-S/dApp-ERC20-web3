import { ChangeEvent, FC, useState } from 'react';

import { ITokens, tokens } from '@assets/constants';
import Close from '@assets/icons/close.svg';
import Search from '@assets/icons/search.svg';

import styles from './TokenPopup.module.css';

type Props = {
  onCLose: () => void;
  onSelect: (token: ITokens) => void;
};

export const TokenPopup: FC<Props> = ({ onCLose, onSelect }) => {
  const allTokens = [...tokens];

  const [searchText, setSearchText] = useState('');

  const tokenArr = allTokens.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
  const firstTokensGroup = tokenArr.splice(0, 7);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectToken = (name: string) => () => {
    const token = tokens.find((item) => item.name === name);
    if (token) {
      onSelect(token);
    }
  };

  const handleClearInput = () => {
    setSearchText('');
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
          <input
            value={searchText}
            className={styles.input}
            placeholder="Search asset or paste address"
            onChange={handleChangeInput}
          />
          <div className={styles.inputCLoseIcon} onClick={handleClearInput}>
            <Close />
          </div>
        </div>
        <div className={styles.tokensRow}>
          {firstTokensGroup.map((item) => (
            <div className={styles.tokenItem} onClick={handleSelectToken(item.name)}>
              <div className={styles.tokenIcon}>{item.icon}</div>
              <div className={styles.tokenSymbol}> {item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.listBlock}>
        {tokenArr.map((item) => (
          <div className={styles.listItem} onClick={handleSelectToken(item.name)}>
            <div className={styles.tokenIcon}>{item.icon}</div>
            <div className={styles.tokenSymbol}> {item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
