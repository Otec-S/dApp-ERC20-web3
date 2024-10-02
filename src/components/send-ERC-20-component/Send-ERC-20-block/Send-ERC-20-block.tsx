import { FC, useState } from 'react';
import { Address } from 'viem';

import AddTokenInfo from '@src/components/add-token-info-popup/AddTokenInfo';
import { TokenData } from '@src/shared/constants';

import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import style from './Send-ERC-20-block.module.css';

const SendERC20Block: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [txHash, setTxHash] = useState<Address | null>(null);
  const [isTxSuccess, setIsTxSuccess] = useState(true);
  const [isTxFormSubmitted, setIsTxFormSubmitted] = useState(false);
  const [isCustomTokenPopupOpen, setIsCustomTokenPopupOpen] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [tokenName, setTokenName] = useState('ARB');

  const handleCloseCustomTokenPopup = (data: TokenData) => {
    setIsCustomTokenPopupOpen(false);
    if (data && data.tokenName) {
      setTokenData(data);
      setTokenName(data.tokenName);
    }
  };

  return (
    <>
      <section className={style.block}>
        <div className={style.blockTitle}>
          {isTxFormSubmitted
            ? isTxSuccess
              ? 'Tokens have been successfully sent!'
              : 'Something went wrong'
            : 'Send ERC-20'}
        </div>
        {isTxFormSubmitted ? (
          <SendERC20ResultForm
            isTxSuccess={isTxSuccess}
            setIsTxFormSubmitted={setIsTxFormSubmitted}
            numberOfTokens={inputValue}
            setInputValue={setInputValue}
            tokenName={tokenName}
            setTokenName={setTokenName}
            setTokenData={setTokenData}
            txHash={txHash}
          />
        ) : (
          <SendERC20SendForm
            setIsTxSuccess={setIsTxSuccess}
            setIsTxFormSubmitted={setIsTxFormSubmitted}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setTokenName={setTokenName}
            setIsCustomTokenPopupOpen={setIsCustomTokenPopupOpen}
            tokenData={tokenData}
            setTxHash={setTxHash}
          />
        )}
      </section>
      {isCustomTokenPopupOpen && (
        <div className={style.overlay}>
          <AddTokenInfo onClose={handleCloseCustomTokenPopup} />
        </div>
      )}
    </>
  );
};

export default SendERC20Block;
