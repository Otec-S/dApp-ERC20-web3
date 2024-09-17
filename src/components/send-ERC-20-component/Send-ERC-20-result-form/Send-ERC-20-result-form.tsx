import style from './Send-ERC-20-result-form.module.css';
import resultSuccessIcon from '../../../assets/resultSuccessIcon.svg';
import resultErrorIcon from '../../../assets/resultErrorIcon.png';
import viewTransactionIcon from '../../../assets/view_tx.svg';

interface ISendERC20ResultFormProps {
  isSuccess: boolean;
}

const SendERC20ResultForm: React.FC<ISendERC20ResultFormProps> = ({ isSuccess }) => {
  const balance = 5800;
  const formattedBalance = balance.toLocaleString('en-US');

  return (
    <div className={style.resultForm}>
      <img className={style.resultIcon} src={isSuccess ? resultSuccessIcon : resultErrorIcon} alt="Result icon" />
      <p className={style.transactionValue}>{formattedBalance} USDT</p>
      <img className={style.viewTransactionIcon} src={viewTransactionIcon} alt="View transaction icon" />
    </div>
  );
};

export default SendERC20ResultForm;
