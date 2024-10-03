import { FC } from 'react';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

import FailureIcon from '@assets/icons/failure.svg';
import SuccessIcon from '@assets/icons/success.svg';
import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import FormButton from '@src/components/form-button/FormButton';
import { getChainURL } from '@src/utils/getChainURL';

import style from './Send-ERC-20-result-form.module.css';

interface Props {
  isTxSuccess: boolean;
  numberOfTokens: string;
  tokenName: string;
  txHash: Address | null;
  onResultFormSubmitted: () => void;
}

const SendERC20ResultForm: FC<Props> = ({ isTxSuccess, numberOfTokens, tokenName, txHash, onResultFormSubmitted }) => {
  const chainId = useChainId();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onResultFormSubmitted();
  };

  const handleViewTransactionIconClick = () => {
    const baseURL = getChainURL(chainId);

    if (baseURL) {
      const url = `${baseURL}/tx/${txHash}`;
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
