import { FC, useState } from "react";
import style from "./Send-ERC-20-block.module.css"; // Импорт стилей для блока
import SubmitButton from "../../../UI/submit-button/Submit-button";
import SendERC20SendForm from "../Send-ERC-20-send-form/Send-ERC-20-send-form";

interface ISendERC20BlockProps {
  blockTitleText: string;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({ blockTitleText }) => {
  const [isButtonActive, setIsButtonActive] = useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        <SendERC20SendForm setIsButtonActive={setIsButtonActive} />
        <SubmitButton buttonText="Send" isButtonActive={isButtonActive} />
      </form>
    </section>
  );
};

export default SendERC20Block;
