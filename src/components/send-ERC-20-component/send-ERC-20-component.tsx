import style from "./Send-ERC-20-component.module.css";
import USDTLogo from "../../assets/USDTLogo.svg";
import arrow_down from "../../assets/arrow_down.svg";
import { useState } from "react";
import SubmitButton from "../../UI/submit-button/Submit-button";
import SendERC20Block from "./Send-ERC-20-block/Send-ERC-20-block";
import SendERC20SendForm from "./Send-ERC-20-send-form/Send-ERC-20-send-form";

const SendERC20Component = () => {
  // const [inputValue, setInputValue] = useState(0);
  // const [recipientValue, setRecipientValue] = useState("");
  // const balance = 5800;
  // const formattedBalance = balance.toLocaleString("en-US");

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log("Form submitted");
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseFloat(event.target.value);
  //   setInputValue(isNaN(value) ? 0 : value);
  // };

  // const handleRecipientChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRecipientValue(event.target.value);
  // };

  // const isButtonActive = inputValue > 0 && recipientValue.length > 0;

  return (
    <>
      <main className={style.component}>
        <SendERC20Block blockTitleText="Send ERC-20" />
        {/* <form className={style.blockForm} onSubmit={handleSubmit}>
            <div className={style.sender}>
              <div className={style.inputBlock}>
                <input
                  className={style.input}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <div className={style.balance}>
                  <div className={style.balanceValue}>
                    Balance {formattedBalance}
                  </div>
                  <img src={balanceMaxSign} alt="Max balance icon" />
                </div>
              </div>

              <div className={style.tokenBlock}>
                <div className={style.availableTokensSelector}>
                  <img
                    className={style.availableTokenLogo}
                    src={USDTLogo}
                    alt="Current token icon"
                  />
                  <img
                    className={style.availableTokenArrowDown}
                    src={arrow_down}
                    alt="Down arrow icon"
                  />
                </div>

                <div className={style.addCustomToken}>+ Add a custom token</div>
              </div>
            </div>
            <div className={style.recipient}>
              <input
                className={style.recipientInput}
                placeholder="0x0000000000000000000000000000000000000000"
                value={recipientValue}
                onChange={handleRecipientChange}
              />
            </div>
            <SubmitButton isButtonActive={isButtonActive} buttonText="Send" />
          </form> */}
      </main>
    </>
  );
};

export default SendERC20Component;
