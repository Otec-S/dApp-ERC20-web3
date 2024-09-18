import { FC } from 'react';
import { Address } from 'viem';

import { tokens } from '../../assets/constants';
import defaultTokenLogo from '../../assets/images/token_logo.svg';
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
      <img
        className={styles.tokenImg}
        src={
          tokens.find((t) => t.polygonAddress === tokenAddress || t.sepoliaAddress === tokenAddress)?.iconPath ??
          defaultTokenLogo
        }
        alt="token logo"
      />
      <div className={styles.imgTextWrapper}>
        <span className={styles.tokenNameHeader}>{tokenName}</span>
        <span className={styles.tokenName}>{tokenBalance ? tokenBalance + ' ' + tokenName : '0 UNKNWN'}</span>
      </div>
    </div>
  );
};
