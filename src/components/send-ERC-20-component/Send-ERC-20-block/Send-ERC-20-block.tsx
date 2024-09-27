import { FC, useState } from 'react';

import { ITokenData } from '@src/shared/constants';

import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import style from './Send-ERC-20-block.module.css';

interface ISendERC20BlockProps {
  blockTitleText: string;
  isTxSuccess: boolean;
  setIsTxSuccess: (value: boolean) => void;
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  tokenData: ITokenData | null;
  tokenName: string;
  setTokenName: (value: string) => void;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({
  blockTitleText,
  isTxSuccess,
  setIsTxSuccess,
  isTxFormSubmitted,
  setIsTxFormSubmitted,
  setIsCustomTokenPopupOpen,
  tokenData,
  tokenName,
  setTokenName,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>

      {isTxFormSubmitted ? (
        <SendERC20ResultForm
          isTxSuccess={isTxSuccess}
          setIsTxFormSubmitted={setIsTxFormSubmitted}
          inputValue={inputValue}
          setInputValue={setInputValue}
          tokenName={tokenName}
          setTokenName={setTokenName}
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
        />
      )}
    </section>
  );
};

export default SendERC20Block;
