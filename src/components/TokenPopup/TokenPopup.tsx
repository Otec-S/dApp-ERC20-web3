import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import Close from '@assets/icons/close.svg';
import Search from '@assets/icons/search.svg';

import { IToken, tokens } from '../../shared/constants';
import styles from './TokenPopup.module.css';

type Props = {
  onCLose: () => void;
  onSelect: (token: IToken) => void;
};

export const TokenPopup: FC<Props> = ({ onCLose, onSelect }) => {
  const [searchText, setSearchText] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  const tokenArr = tokens.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
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

  // Обработчик закрытия по Esc
  const handleEscDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCLose();
    }
  };

  // Обработчик закрытия по клику вне попапа
  const handleClickOutside = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onCLose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={popupRef}>
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
