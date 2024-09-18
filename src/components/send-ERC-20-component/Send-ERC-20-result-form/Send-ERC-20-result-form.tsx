import style from './Send-ERC-20-result-form.module.css';
import resultSuccessIcon from '../../../assets/resultSuccessIcon.svg';
import resultErrorIcon from '../../../assets/resultErrorIcon.png';
import viewTransactionIcon from '../../../assets/view_tx.svg';
import SubmitButton from '../../../UI/submit-button/Submit-button';

interface ISendERC20ResultFormProps {
  isTxSuccess: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  inputValue: string;
}

const SendERC20ResultForm: React.FC<ISendERC20ResultFormProps> = ({
  isTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
}) => {
  // const balance = 5800;
  // const formattedBalance = balance.toLocaleString('en-US');

  // TODO: временно
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    setIsTxFormSubmitted(false);
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
