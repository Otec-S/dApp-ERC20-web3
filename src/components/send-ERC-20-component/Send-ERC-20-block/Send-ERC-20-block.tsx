import { FC, useState } from 'react';

import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import style from './Send-ERC-20-block.module.css';

interface ISendERC20BlockProps {
  blockTitleText: string;
  isTxSuccess: boolean;
  setIsTxSuccess: (value: boolean) => void;
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({
  blockTitleText,
  isTxSuccess,
  setIsTxSuccess,
  isTxFormSubmitted,
  setIsTxFormSubmitted,
}) => {
  const [inputValue, setInputValue] = useState('0');

  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>

      {isTxFormSubmitted ? (
        <SendERC20ResultForm
          isTxSuccess={isTxSuccess}
          setIsTxFormSubmitted={setIsTxFormSubmitted}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      ) : (
        <SendERC20SendForm
          setIsTxSuccess={setIsTxSuccess}
          isTxFormSubmitted={isTxFormSubmitted}
          setIsTxFormSubmitted={setIsTxFormSubmitted}
          inputValue={inputValue}
          setInputValue={setInputValue}
          // TODO: FIXME:
          token="0x8aC43Ed0652168827FA3906577dD44e4819B11D1"
        />
      )}
    </section>
  );
};

export default SendERC20Block;
