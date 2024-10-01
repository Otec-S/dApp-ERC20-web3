import { useState } from 'react';

import AddTokenInfo from '@src/components/add-token-info-popup/AddTokenInfo';
import { TokenData } from '@src/shared/constants';

import Header from '../../components/header/Header';
import SendERC20Block from '../../components/send-ERC-20-component/Send-ERC-20-block/Send-ERC-20-block';
import style from './Send-ERC-20.module.css';

const SendERC20 = () => {
  const [isCustomTokenPopupOpen, setIsCustomTokenPopupOpen] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null); // Состояние для хранения данных токена
  const [tokenName, setTokenName] = useState<string>('ARB');

  const handleCloseCustomTokenPopup = (data: TokenData) => {
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
          setIsCustomTokenPopupOpen={setIsCustomTokenPopupOpen}
          tokenData={tokenData} //6
          setTokenData={setTokenData} //7
          tokenName={tokenName} //8
          setTokenName={setTokenName} //9
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
