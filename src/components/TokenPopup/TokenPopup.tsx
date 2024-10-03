import { ChangeEvent, FC, useState } from 'react';
import cn from 'classnames';
import { Address, isAddress } from 'viem';

import Close from '@assets/icons/close.svg';
import Search from '@assets/icons/search.svg';
import { ITokens, tokens } from '@src/shared/constants';

import styles from './TokenPopup.module.css';

type Props = {
  colorScheme?: 'dark' | 'light';
  onCLose: () => void;
  onSelect: (token: ITokens) => void;
};

export const TokenPopup: FC<Props> = ({ onCLose, onSelect, colorScheme }) => {
  const [searchText, setSearchText] = useState('');
  let tokenArr = [];
  if (isAddress(searchText)) {
    tokenArr = tokens.filter((item) => item.sepoliaAddress === searchText || item.polygonAddress === searchText);
  } else tokenArr = tokens.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
  const firstTokensGroup = tokenArr.splice(0, 7);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectToken = (address: Address) => () => {
    const token = tokens.find((item) => item.sepoliaAddress === address);
    if (token) {
      onSelect(token);
      onCLose();
    }
  };

  const handleClearInput = () => {
    setSearchText('');
  };

  return (
    <div className={cn(styles.container, { [styles.containerLightScheme]: colorScheme === 'light' })}>
      <div className={cn(styles.searchBlock, { [styles.searchBlockLightScheme]: colorScheme === 'light' })}>
        <div className={styles.searchHead}>
          <p className={styles.searchTitle}>Select a token</p>
          <div className={styles.closePopup} onClick={onCLose}>
            <Close />
          </div>
        </div>
        <div className={cn(styles.searchRow, { [styles.searchRowLightScheme]: colorScheme === 'light' })}>
          <div className={cn(styles.searchIcon, { [styles.searchIconLightScheme]: colorScheme === 'light' })}>
            <Search />
          </div>
          <input
            value={searchText}
            className={cn(styles.input, { [styles.inputLightScheme]: colorScheme === 'light' })}
            placeholder="Search asset or paste address"
            onChange={handleChangeInput}
          />
          <div className={styles.inputCLoseIcon} onClick={handleClearInput}>
            <Close />
          </div>
        </div>
        <div className={styles.tokensRow}>
          {firstTokensGroup.map((item) => (
            <div
              key={item.polygonAddress}
              className={cn(styles.tokenItem, { [styles.tokenItemLightScheme]: colorScheme === 'light' })}
              onClick={handleSelectToken(item.sepoliaAddress)}
            >
              <div className={styles.tokenIcon}>{item.icon}</div>
              <div className={cn(styles.tokenSymbol, { [styles.tokenSymbolLightScheme]: colorScheme === 'light' })}>
                {' '}
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.listBlock}>
        {tokenArr.map((item) => (
          <div
            key={item.sepoliaAddress}
            className={cn(styles.listItem, { [styles.listItemLIghtScheme]: colorScheme === 'light' })}
            onClick={handleSelectToken(item.sepoliaAddress)}
          >
            <div className={styles.tokenIcon}>{item.icon}</div>
            <div className={cn(styles.tokenSymbol, { [styles.tokenSymbolLightScheme]: colorScheme === 'light' })}>
              {' '}
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
