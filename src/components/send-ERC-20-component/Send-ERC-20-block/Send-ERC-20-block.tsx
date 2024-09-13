import { FC } from "react";
import style from "./Send-ERC-20-block.module.css"; // Импорт стилей для блока

interface ISendERC20BlockProps {
  blockTitleText: string;
  children: React.ReactNode;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({
  children,
  blockTitleText,
}) => {
  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>
      {children}
    </section>
  );
};

export default SendERC20Block;
