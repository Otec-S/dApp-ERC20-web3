import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

import FailureIcon from '@assets/icons/failure.svg';
import SuccessIcon from '@assets/icons/success.svg';
import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import FormButton from '@components/form-button/FormButton';
import { getChainURL } from '@shared/utils/getChainURL';

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

  const generateTransactionURL = (): string => {
    const baseURL = getChainURL(chainId);

    if (baseURL) {
      return `${baseURL}/tx/${txHash}`;
    } else {
      console.error('Unsupported chain ID or URL not configured for this chain');
      return '#';
    }
  };

  return (
    <form className={style.blockForm} onSubmit={handleSubmit}>
      <div className={style.resultForm}>
        <div className={style.resultIcon}>{isTxSuccess ? <SuccessIcon /> : <FailureIcon />}</div>
        <p className={style.transactionValue}>
          {numberOfTokens} {tokenName}
        </p>
        <Link
          className={style.viewTransactionIcon}
          to={generateTransactionURL()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ViewTransactionIcon />
        </Link>
      </div>
      <FormButton buttonText={isTxSuccess ? 'Great!' : 'Start again'} />
    </form>
  );
};

export default SendERC20ResultForm;
