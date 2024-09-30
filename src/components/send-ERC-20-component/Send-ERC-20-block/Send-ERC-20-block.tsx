import { FC, useState } from 'react';
import { Address } from 'viem';

import { TokenData } from '@src/shared/constants';

import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import style from './Send-ERC-20-block.module.css';

interface Props {
  blockTitleText: string;
  isTxSuccess: boolean;
  setIsTxSuccess: (value: boolean) => void;
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  tokenData: TokenData | null;
  setTokenData: (value: TokenData | null) => void;
  tokenName: string;
  setTokenName: (value: string) => void;
}

const SendERC20Block: FC<Props> = ({
  blockTitleText,
  isTxSuccess,
  setIsTxSuccess,
  isTxFormSubmitted,
  setIsTxFormSubmitted,
  setIsCustomTokenPopupOpen,
  tokenData,
  setTokenData,
  tokenName,
  setTokenName,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [txHash, setTxHash] = useState<Address>('0x0');
  console.log('txHash:', txHash);

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
