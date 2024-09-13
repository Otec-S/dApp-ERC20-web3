import style from "./Send-ERC-20-component.module.css";
import balanceMaxSign from "../../assets/balanceMaxSign.svg";
import USDTLogo from "../../assets/USDTLogo.svg";
import arrow_down from "../../assets/arrow_down.svg";
import { useState } from "react";
import SubmitButton from "../../UI/submit-button/Submit-button";

const SendERC20Component = () => {
  const [inputValue, setInputValue] = useState(0);
  const [recipientValue, setRecipientValue] = useState("");
  // TODO: временно хардкодим баланс, потом будет приходить с сервера
  const balance = 5800;
  const formattedBalance = balance.toLocaleString("en-US");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setInputValue(isNaN(value) ? 0 : value);
  };

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipientValue(event.target.value);
  };

  const isButtonActive = inputValue > 0 && recipientValue.length > 0;

  return (
    <>
      <main className={style.component}>
        <section className={style.block}>
          <div className={style.blockTitle}>Send ERC-20</div>
          <form className={style.blockForm} onSubmit={handleSubmit}>
            <div className={style.sender}>
              <div className={style.inputBlock}>
                {/* TODO: должны быть запятые как разделители разрядов? */}
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
          </form>
        </section>
      </main>
    </>
  );
};

export default SendERC20Component;
