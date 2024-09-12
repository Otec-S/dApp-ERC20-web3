import React from "react";
import style from "./send-ERC-20-component.module.css";
import MockHeader from "../mock-header/mock-header";
import balanceMaxSign from "../../assets/balanceMaxSign.svg";
import USDTLogo from "../../assets/USDTLogo.svg";
import arrow_down from "../../assets/arrow_down.svg";

const SendERC20Component = () => {
  return (
    <>
      <MockHeader />
      <main className={style.component}>
        <section className={style.block}>
          <div className={style.blockTitle}>Send ERC-20</div>
          <div className={style.blockForm}>
            <div className={style.sender}>
              <div className={style.inputBlock}>
                {/* TODO: должны быть запятые как разделители разрядов? */}
                <input className={style.input} type="text" value="0" />
                <div className={style.balance}>
                  <div className={style.balanceValue}>Balance 5,800.00</div>
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

            <div className={style.recipient}></div>
            <button className={style.button}>Send</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default SendERC20Component;
