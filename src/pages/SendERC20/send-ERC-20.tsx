import style from './Send-ERC-20.module.css';
import SendERC20Block from '../../components/send-ERC-20-component/Send-ERC-20-block/Send-ERC-20-block';
import { useState } from 'react';
import Header from '../../components/header/Header';

const SendERC20Component = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTxFormSubmitted, setIssTxFormSubmitted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTxSuccess, setIsTxSuccess] = useState(true);

  return (
    <div className={style.component}>
      <Header />
      <SendERC20Block
        isTxSuccess={isTxSuccess}
        setIsTxSuccess={setIsTxSuccess}
        isTxFormSubmitted={isTxFormSubmitted}
        setIsTxFormSubmitted={setIssTxFormSubmitted}
        blockTitleText={isTxFormSubmitted ? 'Tokens has been successfully sent!' : 'Send ERC-20'}
      />
      {/* <SendERC20Block
          isSuccess={isSuccess}
          blockTitleText={isSuccess ? 'Tokens has been successfully sent!' : 'Something went wrong'}
        /> */}
    </div>
  );
};

export default SendERC20Component;
