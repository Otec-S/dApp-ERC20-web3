import style from './Send-ERC-20-component.module.css';
import SendERC20Block from './Send-ERC-20-block/Send-ERC-20-block';
import { useState } from 'react';
import Header from '../header/Header';

const SendERC20Component = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSuccess, setIsSuccess] = useState(true);

  return (
    <div className={style.component}>
      <Header />
      <SendERC20Block isSuccess={isSuccess} blockTitleText="Send ERC-20" />
      {/* <SendERC20Block
          isSuccess={isSuccess}
          blockTitleText={isSuccess ? 'Tokens has been successfully sent!' : 'Something went wrong'}
        /> */}
    </div>
  );
};

export default SendERC20Component;
