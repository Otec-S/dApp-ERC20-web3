import { FC } from 'react';

import FailureIcon from '@assets/icons/failure.svg';
import SuccessIcon from '@assets/icons/success.svg';
import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import FormButton from '@src/components/form-button/FormButton';
import { TokenData } from '@src/shared/constants';

import style from './Send-ERC-20-result-form.module.css';

interface Props {
  isTxSuccess: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  tokenName: string;
  setTokenName: (value: string) => void;
  setTokenData: (value: TokenData | null) => void;
}

const SendERC20ResultForm: FC<Props> = ({
  isTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  tokenName,
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

  return (
    <form className={style.blockForm} onSubmit={handleSubmit}>
      <div className={style.resultForm}>
        {/* TODO: */}
        {/* <img
          className={style.resultIcon}
          src={isTxSuccess ? resultSuccessIcon.default : resultErrorIcon.default}
          alt="Result icon"
        /> */}
        <div className={style.resultIcon}>{isTxSuccess ? <SuccessIcon /> : <FailureIcon />}</div>
        <p className={style.transactionValue}>
          {inputValue} {tokenName}
        </p>
        <div className={style.viewTransactionIcon}>
          <ViewTransactionIcon />
        </div>
      </div>
      <FormButton buttonText={isTxSuccess ? 'Great!' : 'Start again'} />
    </form>
  );
};

export default SendERC20ResultForm;
