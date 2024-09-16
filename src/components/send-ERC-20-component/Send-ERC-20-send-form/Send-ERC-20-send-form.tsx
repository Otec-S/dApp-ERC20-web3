import { FC, useEffect, useState } from 'react';
import style from './Send-ERC-20-send-form.module.css';
import balanceMaxSign from '../../../assets/balanceMaxSign.svg';
import USDTLogo from '../../../assets/USDTLogo.svg';
import arrow_down from '../../../assets/arrow_down.svg';
// import { useBalance } from 'wagmi';
// import { getBalance } from '@wagmi/core';
// import { config } from '../../../../wagmiConfig';
// import { sepolia } from 'viem/chains';

interface ISendERC20SendFormProps {
  setIsButtonActive?: (value: boolean) => void;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({ setIsButtonActive }) => {
  const [inputValue, setInputValue] = useState(0);
  const [recipientValue, setRecipientValue] = useState('');
  const balance = 5800;
  const formattedBalance = balance.toLocaleString('en-US');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setInputValue(isNaN(value) ? 0 : value);
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientValue(event.target.value);
  };

  useEffect(() => {
    if (setIsButtonActive) {
      setIsButtonActive(inputValue > 0 && recipientValue.length > 0);
    }
  }, [inputValue, recipientValue, setIsButtonActive]);

  // TODO: получение баланса

  // const currentBalance = getBalance(config, {
  //   address: '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054',
  //   chainId: sepolia.id,
  // });

  // console.log('balance:', currentBalance);

  // Получаем баланс для текущего кошелька
  // const { isConnected, address } = useAccount();

  // const {
  //   data: balanceData,
  //   isLoading,
  //   error,
  // } = useBalance({
  //   address,
  // });

  // console.log('balanceData:', balanceData);

  return (
    <>
      <div className={style.sender}>
        <div className={style.inputBlock}>
          <input className={style.input} type="text" value={inputValue} onChange={handleInputChange} />
          <div className={style.balance}>
            <div className={style.balanceValue}>Balance {formattedBalance}</div>
            <img src={balanceMaxSign} alt="Max balance icon" />
          </div>
        </div>

        <div className={style.tokenBlock}>
          <div className={style.availableTokensSelector}>
            <img className={style.availableTokenLogo} src={USDTLogo} alt="Current token icon" />
            <img className={style.availableTokenArrowDown} src={arrow_down} alt="Down arrow icon" />
          </div>

          <div className={style.addCustomToken}>+ Add a custom token</div>
        </div>
      </div>
      <div className={style.recipient}>
        <input
          className={style.recipientInput}
          placeholder="0x0000000000000000000000000000000000000000"
          value={recipientValue}
          onChange={handleRecipientChange}
        />
      </div>
    </>
  );
};

export default SendERC20SendForm;
