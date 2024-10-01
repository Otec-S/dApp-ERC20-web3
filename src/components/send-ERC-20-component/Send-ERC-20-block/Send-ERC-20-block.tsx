import { FC, useState } from 'react';
import { Address } from 'viem';

import { TokenData } from '@src/shared/constants';

import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import style from './Send-ERC-20-block.module.css';

interface Props {
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  tokenData: TokenData | null;
  setTokenData: (value: TokenData | null) => void;
  tokenName: string;
  setTokenName: (value: string) => void;
}

const SendERC20Block: FC<Props> = ({ setIsCustomTokenPopupOpen, tokenData, setTokenData, tokenName, setTokenName }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [txHash, setTxHash] = useState<Address>('0x0');
  console.log('txHash:', txHash);

  const [isTxSuccess, setIsTxSuccess] = useState(true);
  const [isTxFormSubmitted, setIsTxFormSubmitted] = useState(false);

  // TODO:

  {
    /* <div className=" стили с position:relative например чтобы popup с position:absolute показывался внутри него. У нас у всех popup вроде position:absolute установлено сразу в стилях">
{
isCustomTokenPopupOpen && <AddTokenInfo  onClosePopup = {твой хендлер чтобы получить из popup сведения} >
}
</div> */
  }

  return (
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
          inputValue={inputValue}
          setInputValue={setInputValue}
          tokenName={tokenName}
          setTokenName={setTokenName}
          setTokenData={setTokenData}
          txHash={txHash}
        />
      ) : (
        <SendERC20SendForm
          setIsTxSuccess={setIsTxSuccess}
          isTxFormSubmitted={isTxFormSubmitted}
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
  );
};

export default SendERC20Block;
