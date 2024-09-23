import { FC } from 'react';
import cn from 'classnames';
import { Address, formatUnits } from 'viem';

import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';

import { tokens } from '../../shared/constants';
import styles from './TokenInfo.module.css';

interface Props {
  tokenAddress?: Address;
  contractData: [number, string, bigint] | undefined;
  colorScheme?: 'default' | 'yellow';
}

export const TokenInfo: FC<Props> = ({ tokenAddress, contractData, colorScheme = 'default' }) => {
  if (contractData) {
    const [tokenDecimals, tokenName, tokenBalance] = contractData;
    const balance =
      formatUnits(tokenBalance, tokenDecimals).length > 0 ? formatUnits(tokenBalance, tokenDecimals) : '0';
    return (
      <div className={styles.tokenImgWrapper}>
        {tokens.find((t) => t.polygonAddress === tokenAddress || t.sepoliaAddress === tokenAddress)?.icon ?? (
          <NotFoundTokenLogo />
        )}
        <div className={cn(styles.imgTextWrapper, { [styles.imgTextWrapperYellowScheme]: colorScheme === 'yellow' })}>
          <span className={styles.tokenNameHeader}>{tokenName}</span>
          <span className={styles.tokenName}>{balance + ' ' + tokenName}</span>
        </div>
      </div>
    );
  }
  return <span>{tokenAddress}</span>;
};

export default TokenInfo;
