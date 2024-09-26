import { useState } from 'react';

import AddTokenInfo from '@src/components/add-token-info-popup/AddTokenInfo';
import { ITokenData } from '@src/shared/constants';

import Header from '../../components/header/Header';
import SendERC20Block from '../../components/send-ERC-20-component/Send-ERC-20-block/Send-ERC-20-block';
import style from './Send-ERC-20.module.css';

const SendERC20 = () => {
  const [isTxFormSubmitted, setIssTxFormSubmitted] = useState(false);
  const [isTxSuccess, setIsTxSuccess] = useState(true);
  const [isCustomTokenPopupOpen, setIsCustomTokenPopupOpen] = useState(false);

  const [tokenData, setTokenData] = useState<ITokenData | null>(null); // Состояние для хранения данных токена

  const handleCloseCustomTokenPopup = (data: ITokenData) => {
    setIsCustomTokenPopupOpen(false);
    if (data) {
      setTokenData(data); // Установите данные токена в состояние
      console.log('Токен данные:', data); // Вывод данных токена
    }
  };

  return (
    <>
      <div className={style.component}>
        <Header />
        <SendERC20Block
          isTxSuccess={isTxSuccess}
          setIsTxSuccess={setIsTxSuccess}
          isTxFormSubmitted={isTxFormSubmitted}
          setIsTxFormSubmitted={setIssTxFormSubmitted}
          setIsCustomTokenPopupOpen={setIsCustomTokenPopupOpen}
          blockTitleText={
            isTxFormSubmitted
              ? isTxSuccess
                ? 'Tokens have been successfully sent!'
                : 'Something went wrong'
              : 'Send ERC-20'
          }
          tokenData={tokenData}
        />
      </div>

      {isCustomTokenPopupOpen && (
        <div className={style.overlay}>
          <AddTokenInfo setIsCustomTokenPopupOpen={setIsCustomTokenPopupOpen} onClose={handleCloseCustomTokenPopup} />
        </div>
      )}
    </>
  );
};

export default SendERC20;
