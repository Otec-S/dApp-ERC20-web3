import style from "./Send-ERC-20-component.module.css";
import SendERC20Block from "./Send-ERC-20-block/Send-ERC-20-block";

const SendERC20Component = () => {
  return (
    <main className={style.component}>
      {/* <SendERC20Block blockTitleText="Send ERC-20" /> */}
      <SendERC20Block blockTitleText="Tokens has been successfully sent!" />
    </main>
  );
};

export default SendERC20Component;
