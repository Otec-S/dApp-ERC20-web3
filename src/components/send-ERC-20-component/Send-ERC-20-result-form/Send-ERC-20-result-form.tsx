import { FC } from 'react';

import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import { resultErrorIcon, resultSuccessIcon } from '@assets/images';
import FormButton from '@src/components/form-button/FormButton';
import { ITokenData } from '@src/shared/constants';

import style from './Send-ERC-20-result-form.module.css';

interface Props {
  isTxSuccess: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  tokenName: string;
  setTokenName: (value: string) => void;
  setTokenData: (value: ITokenData | null) => void;
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
        <img
          className={style.resultIcon}
          src={isTxSuccess ? resultSuccessIcon.default : resultErrorIcon.default}
          alt="Result icon"
        />
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
