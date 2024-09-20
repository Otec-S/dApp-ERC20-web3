import { FC } from 'react';
import { Address } from 'viem';

import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';

import { tokens } from '../../assets/constants';
import styles from './TokenInfo.module.css';

interface Props {
  tokenName: string;
  tokenAddress: Address;
  tokenBalance: string;
}

export const TokenInfo: FC<Props> = ({ tokenName, tokenAddress, tokenBalance }) => {
  return (
    <div className={styles.tokenImgWrapper}>
      {tokens.find((t) => t.polygonAddress === tokenAddress || t.sepoliaAddress === tokenAddress)?.icon ?? (
        <NotFoundTokenLogo />
      )}
      <div className={styles.imgTextWrapper}>
        <span className={styles.tokenNameHeader}>{tokenName}</span>
        <span className={styles.tokenName}>{tokenBalance + ' ' + tokenName}</span>
      </div>
    </div>
  );
};

export default TokenInfo;
