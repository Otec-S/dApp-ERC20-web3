import { FC, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ARBIcon from '@assets/icons/arb.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import BalanceMaxSign from '@assets/icons/balanceMaxSign.svg';
import { TokenPopup } from '@src/components/TokenPopup/TokenPopup';
import { IToken } from '@src/shared/constants';

import useBalanceCustom from '../../../hooks/useBalanceCustom';
import SubmitButton from '../../../UI/submit-button/Submit-button';
import style from './Send-ERC-20-send-form.module.css';

interface ISendERC20SendFormProps {
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  // token: `0x${string}`;
  decimals: number;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({
  setIsTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  // token,
  decimals,
}) => {
  const [tokenSelected, setTokenSelected] = useState<IToken>({
    id: 1,
    name: 'ARB',
    polygonAddress: '0x34cd8b477eb916c1c4224b2FFA80DE015cCC671b',
    sepoliaAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    icon: <ARBIcon />,
  });
  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [inputValueError, setInputValueError] = useState<string | null>(null);
  const [inputRecipientError, setInputRecipientError] = useState<string | null>(null);
  const [isTokenPopupOpen, setIsTokenPopupOpen] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  const { address } = useAccount();
  const { balance, loadingBalanceCustom, errorBalanceCustom } = useBalanceCustom(
    address as `0x${string}`,
    tokenSelected.sepoliaAddress as `0x${string}`,
    decimals as number,
  );

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Регулярное выражение для проверки числа с точкой
    const inputValueRegex = /^\d*\.?\d*$/;
    if (inputValueRegex.test(value)) {
      setInputValue(value);
      if (balance && parseFloat(value) > parseFloat(balance)) {
        setInputValueError('The amount exceeds your balance');
      } else {
        setInputValueError(null);
      }
    } else {
      setInputValueError('Invalid amount format');
    }
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const recipient = event.target.value;
    const recipientAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (recipientAddressRegex.test(recipient)) {
      setRecipientValue(recipient);
      setInputRecipientError(null);
    } else {
      setInputRecipientError('Invalid Ethereum address format');
    }
  };

  const handleTokenButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsTokenPopupOpen(true);
  };

  // FIXME:
  // Простая функция-заглушка для закрытия попапа
  const handleOnClose = () => {
    setIsTokenPopupOpen(false);
  };
  // FIXME:
  // Простая функция-заглушка для выбора токена
  const handleOnSelect = (tokenSelected: IToken) => {
    setTokenSelected(tokenSelected);
    setIsTokenPopupOpen(false);
    console.log('Token selected:', tokenSelected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    const formData = new FormData(e.target as HTMLFormElement);
    const recipient = formData.get('recipient') as `0x${string}`;
    // TODO: decimals должны сюда передаваться
    const parsedAmount = parseUnits(inputValue, 18);
    writeContract({
      address: tokenSelected.sepoliaAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, parsedAmount],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsTxFormSubmitted(true);
      setIsButtonActive(true);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isConfirming) {
      setIsButtonActive(false);
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isError) {
      console.log('Error: ', isError);
      setIsTxSuccess(false);
    }
  }, [isError]);

  useEffect(() => {
    const inputValueNumber = parseFloat(inputValue);
    if (setIsButtonActive) {
      setIsButtonActive(
        inputValue.length > 0 &&
          inputValueNumber > 0 &&
          recipientValue.length > 0 &&
          !inputValueError &&
          !inputRecipientError,
      );
    }
  }, [inputValue, recipientValue, setIsButtonActive, inputValueError, inputRecipientError]);

  return (
    <>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        <div className={style.sender}>
          <div className={style.inputBlock}>
            <input
              name="value"
              className={style.input}
              type="text"
              value={inputValue}
              placeholder="0.00"
              onChange={handleInputChange}
              required
            />
            <div className={style.balance}>
              <div className={style.balanceValue}>
                {loadingBalanceCustom ? (
                  <span>Loading...</span>
                ) : errorBalanceCustom ? (
                  <span>Error getting wallet balance</span>
                ) : (
                  <span>Balance: {balance}</span>
                )}
              </div>
              <BalanceMaxSign />
            </div>
            {inputValueError && <div className={style.balanceExceededError}>{inputValueError}</div>}
          </div>

          <div className={style.tokenBlock}>
            <button className={style.availableTokensSelector} onClick={handleTokenButtonClick} type="button">
              <div className={style.nameOfToken}>
                <span>{tokenSelected.icon}</span>
                <span>{tokenSelected.name}</span>
              </div>
              <div className={style.availableTokenArrowDown}>
                <ArrowDown />
              </div>
            </button>

            <div className={style.addCustomToken}>+ Add a custom token</div>
          </div>
        </div>
        <div className={style.recipient}>
          <input
            name="recipient"
            className={style.recipientInput}
            placeholder="0x0000000000000000000000000000000000000000"
            onChange={handleRecipientChange}
            required
          />
          {inputRecipientError && <div className={style.inputRecipientError}>{inputRecipientError}</div>}
        </div>
        <SubmitButton buttonText="Send" isButtonActive={isButtonActive} disabled={!isButtonActive} />
        {isTokenPopupOpen && <TokenPopup onCLose={handleOnClose} onSelect={handleOnSelect} />}
      </form>
    </>
  );
};

export default SendERC20SendForm;
