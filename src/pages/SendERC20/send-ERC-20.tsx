import { useState } from 'react';

import Header from '../../components/header/Header';
import SendERC20Block from '../../components/send-ERC-20-component/Send-ERC-20-block/Send-ERC-20-block';
import style from './Send-ERC-20.module.css';

const SendERC20 = () => {
  const [isTxFormSubmitted, setIssTxFormSubmitted] = useState(false);
  const [isTxSuccess, setIsTxSuccess] = useState(true);

  return (
    <div className={style.component}>
      <Header />
      <SendERC20Block
        isTxSuccess={isTxSuccess}
        setIsTxSuccess={setIsTxSuccess}
        isTxFormSubmitted={isTxFormSubmitted}
        setIsTxFormSubmitted={setIssTxFormSubmitted}
        blockTitleText={
          isTxFormSubmitted
            ? isTxSuccess
              ? 'Tokens have been successfully sent!'
              : 'Something went wrong'
            : 'Send ERC-20'
        }
      />
    </div>
  );
};

export default SendERC20;
