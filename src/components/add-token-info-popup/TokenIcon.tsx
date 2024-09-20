import { FC } from 'react';
import { Address } from 'viem';

import { tokens } from '../../assets/constants';
import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';
import styles from './TokenIcon.module.css';

export interface ITokenIcon {
  tokenName: string;
  tokenDecimals: number;
  tokenAddress: Address;
  tokenBalance: string | undefined;
}

export const TokenIcon: FC<ITokenIcon> = ({ tokenName, tokenAddress, tokenBalance }) => {
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

export default TokenIcon;
