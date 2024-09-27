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

  const [tokenName, setTokenName] = useState<string>('ARB');

  const handleCloseCustomTokenPopup = (data: ITokenData) => {
    setIsCustomTokenPopupOpen(false);
    if (data && data.tokenName) {
      setTokenData(data);
      setTokenName(data.tokenName);
    }
  };

  return (
    <>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.component}>
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
          setTokenData={setTokenData}
          tokenName={tokenName}
          setTokenName={setTokenName}
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
