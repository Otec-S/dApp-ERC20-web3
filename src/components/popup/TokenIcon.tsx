import { FC } from 'react';

import { tokens } from '../../assets/constants';
import styles from './TokenIcon.module.css';
import { useToken } from 'wagmi';
import { Address } from 'viem';
import defaultTokenLogo from '../../assets/images/token_logo.svg';

export interface ITokenIcon {
  tokenAddress: Address;
}

export const TokenIcon: FC<ITokenIcon> = ({ tokenAddress }) => {
  const token = useToken({
    address: tokenAddress,
  });

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
        <span className={styles.tokenNameHeader}>{token.data?.name}</span>
        <span className={styles.tokenName}>123</span>
      </div>
    </div>
  );
};
