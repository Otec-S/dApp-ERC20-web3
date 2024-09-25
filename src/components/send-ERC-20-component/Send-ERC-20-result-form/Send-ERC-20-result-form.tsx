import ViewTransactionIcon from '@assets/icons/view_tx.svg';
import { resultErrorIcon, resultSuccessIcon } from '@assets/images';

import SubmitButton from '../../../UI/submit-button/Submit-button';
import style from './Send-ERC-20-result-form.module.css';

interface ISendERC20ResultFormProps {
  isTxSuccess: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  tokenName: string;
  setTokenName: (value: string) => void;
}

const SendERC20ResultForm: React.FC<ISendERC20ResultFormProps> = ({
  isTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  tokenName,
  setTokenName,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTxFormSubmitted(false);
    setInputValue('');
    setTokenName('ARB');
  };

  console.log('tokenName in RESULT:', tokenName);

  return (
    <form className={style.blockForm} onSubmit={handleSubmit}>
      <div className={style.resultForm}>
        <img
          className={style.resultIcon}
          src={isTxSuccess ? resultSuccessIcon.default : resultErrorIcon.default}
          alt="Result icon"
        />
        {/* TODO: поправь единицы измерения */}
        <p className={style.transactionValue}>
          {inputValue} {tokenName}
        </p>
        <div className={style.viewTransactionIcon}>
          <ViewTransactionIcon />
        </div>
      </div>
      <SubmitButton buttonText={isTxSuccess ? 'Great!' : 'Start again'} />
    </form>
  );
};

export default SendERC20ResultForm;
