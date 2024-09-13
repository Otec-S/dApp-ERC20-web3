import style from "./Send-ERC-20-result-form.module.css";
import resultSuccessIcon from "../../../assets/resultSuccessIcon.svg";
import viewTransactionIcon from "../../../assets/view_tx.svg";

const SendERC20ResultForm = () => {
  const balance = 5800;
  const formattedBalance = balance.toLocaleString("en-US");

  return (
    <div className={style.resultForm}>
      <img
        className={style.resultSuccessIcon}
        src={resultSuccessIcon}
        alt="Result success icon"
      />
      <p className={style.transactionValue}>{formattedBalance} USDT</p>
      <img
        className={style.viewTransactionIcon}
        src={viewTransactionIcon}
        alt="View transaction icon"
      />
    </div>
  );
};

export default SendERC20ResultForm;
