import style from './Send-ERC-20-result-form.module.css';
import resultSuccessIcon from '../../../assets/resultSuccessIcon.svg';
import resultErrorIcon from '../../../assets/resultErrorIcon.png';
import viewTransactionIcon from '../../../assets/view_tx.svg';
import SubmitButton from '../../../UI/submit-button/Submit-button';

interface ISendERC20ResultFormProps {
  isTxSuccess: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const SendERC20ResultForm: React.FC<ISendERC20ResultFormProps> = ({
  isTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTxFormSubmitted(false);
    setInputValue('0');
  };

  return (
    <form className={style.blockForm} onSubmit={handleSubmit}>
      <div className={style.resultForm}>
        <img className={style.resultIcon} src={isTxSuccess ? resultSuccessIcon : resultErrorIcon} alt="Result icon" />
        <p className={style.transactionValue}>{inputValue} ETH</p>
        <img className={style.viewTransactionIcon} src={viewTransactionIcon} alt="View transaction icon" />
      </div>
      <SubmitButton buttonText="Great!" />
    </form>
  );
};

export default SendERC20ResultForm;
