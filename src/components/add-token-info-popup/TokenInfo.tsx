import { FC } from 'react';
import cn from 'classnames';
import { Address } from 'viem';

import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';

import { tokens } from '../../assets/constants';
import styles from './TokenInfo.module.css';

interface Props {
  tokenName: string;
  tokenAddress: Address;
  tokenBalance: string;
  colorScheme?:'default'|'yellow'
}

export const TokenInfo: FC<Props> = ({ tokenName, tokenAddress, tokenBalance ,colorScheme='default'}) => {
  return (
    <div className={styles.tokenImgWrapper}>
      {tokens.find((t) => t.polygonAddress === tokenAddress || t.sepoliaAddress === tokenAddress)?.icon ?? (
        <NotFoundTokenLogo />
      )}
      <div className={cn(styles.imgTextWrapper,{[styles.imgTextWrapperYellowScheme]:colorScheme==='yellow'})}>
        <span className={styles.tokenNameHeader}>{tokenName}</span>
        <span className={styles.tokenName}>{tokenBalance + ' ' + tokenName}</span>
      </div>
    </div>
  );
};

export default TokenInfo;
