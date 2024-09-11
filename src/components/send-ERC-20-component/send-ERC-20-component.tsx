import React from "react";
import style from "./send-ERC-20-component.module.css";
import MockHeader from "../mock-header/mock-header";

const SendERC20Component = () => {
  return (
    <>
      <MockHeader />
      <main className={style.component}>
        <section className={style.block}></section>
      </main>
    </>
  );
};

export default SendERC20Component;
