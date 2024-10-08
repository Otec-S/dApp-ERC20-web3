import { FC } from 'react';

import Header from '@components/header/Header';
import SendERC20Block from '@components/send-ERC-20-component/Send-ERC-20-block/Send-ERC-20-block';

import style from './Send-ERC-20.module.css';

const SendERC20: FC = () => {
  return (
    <>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.component}>
        <SendERC20Block />
      </div>
    </>
  );
};

export default SendERC20;
