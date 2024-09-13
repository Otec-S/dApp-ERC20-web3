import { FC, useState } from "react";
import style from "./Send-ERC-20-block.module.css"; // Импорт стилей для блока
import SubmitButton from "../../../UI/submit-button/Submit-button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SendERC20SendForm from "../Send-ERC-20-send-form/Send-ERC-20-send-form";
import SendERC20ResultForm from "../Send-ERC-20-result-form/Send-ERC-20-result-form";

interface ISendERC20BlockProps {
  blockTitleText: string;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({ blockTitleText }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isButtonActive, setIsButtonActive] = useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        {/* <SendERC20SendForm setIsButtonActive={setIsButtonActive} /> */}
        <SendERC20ResultForm />
        <SubmitButton buttonText="Great!" isButtonActive={isButtonActive} />
      </form>
    </section>
  );
};

export default SendERC20Block;
