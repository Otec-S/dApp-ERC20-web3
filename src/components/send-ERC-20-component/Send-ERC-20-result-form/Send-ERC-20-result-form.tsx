import { FC } from 'react';
import { Address } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useChainId } from 'wagmi';

import FailureIcon from '@assets/icons/failure.svg';
import SuccessIcon from '@assets/icons/success.svg';
import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import FormButton from '@src/components/form-button/FormButton';
import { TokenData } from '@src/shared/constants';

import style from './Send-ERC-20-result-form.module.css';

interface Props {
  isTxSuccess: boolean;
  numberOfTokens: string;
  tokenName: string;
  txHash: Address | null;
  setIsTxFormSubmitted: (value: boolean) => void;
  setInputValue: (value: string) => void;
  setTokenName: (value: string) => void;
  setTokenData: (value: TokenData | null) => void;
}

const SendERC20ResultForm: FC<Props> = ({
  isTxSuccess,
  numberOfTokens,
  tokenName,
  txHash,
  setIsTxFormSubmitted,
  setInputValue,
  setTokenName,
  setTokenData,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTxFormSubmitted(false);
    setInputValue('');
    setTokenName('ARB');
    setTokenData(null);
  };

  const chainId = useChainId();

  const getChainURL = (id: number) => {
    switch (id) {
      case sepolia.id:
        return 'sepolia.etherscan.io';
      case polygonAmoy.id:
        return 'amoy.polygonscan.com';
      default:
        return '';
    }
  };

  const handleViewTransactionIconClick = () => {
    const baseURL = getChainURL(chainId);

    if (baseURL) {
      const url = `https://${baseURL}/tx/${txHash}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Unsupported chain ID or URL not configured for this chain');
    }
  };

  return (
    <form className={style.blockForm} onSubmit={handleSubmit}>
      <div className={style.resultForm}>
        <div className={style.resultIcon}>{isTxSuccess ? <SuccessIcon /> : <FailureIcon />}</div>
        <p className={style.transactionValue}>
          {numberOfTokens} {tokenName}
        </p>
        <button className={style.viewTransactionIcon} onClick={handleViewTransactionIconClick} type="button">
          <ViewTransactionIcon />
        </button>
      </div>
      <FormButton buttonText={isTxSuccess ? 'Great!' : 'Start again'} />
    </form>
  );
};

export default SendERC20ResultForm;
