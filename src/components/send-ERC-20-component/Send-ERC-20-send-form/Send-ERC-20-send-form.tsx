import { CSSProperties, FC, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { parseUnits } from 'viem';
import { erc20Abi } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ARBIcon from '@assets/icons/arb.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import BalanceMaxSign from '@assets/icons/balanceMaxSign.svg';
import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';
import { TokenPopup } from '@src/components/TokenPopup/TokenPopup';
import { IToken, ITokenData } from '@src/shared/constants';

import useBalanceCustom from '../../../hooks/useBalanceCustom';
import SubmitButton from '../../../UI/submit-button/Submit-button';
import style from './Send-ERC-20-send-form.module.css';

interface ISendERC20SendFormProps {
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  setTokenName: (value: string) => void;
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  tokenData: ITokenData | null;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({
  setIsTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  setTokenName,
  setIsCustomTokenPopupOpen,
  tokenData,
}) => {
  // TODO:

  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [inputValueError, setInputValueError] = useState<string | null>(null);
  const [inputRecipientError, setInputRecipientError] = useState<string | null>(null);
  const [isRegularTokenPopupOpen, setIsRegularTokenPopupOpen] = useState(false);
  const [decimals, setDecimals] = useState<number>(18);

  const override: CSSProperties = {
    display: 'block',
    margin: '100px auto',
  };

  const { data: hash, error: isError, writeContract } = useWriteContract();
  console.log('isError', isError);

  const { address } = useAccount(); // адрес кошелька

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    // isError: isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // console.log('isConfirming', isConfirming);
  // console.log('isConfirmed', isConfirmed);
  // console.log('isError', isError);

  const chainId = useChainId();

  const [tokenSelected, setTokenSelected] = useState<IToken>({
    id: 1,
    name: 'ARB',
    polygonAddress: '0x34cd8b477eb916c1c4224b2FFA80DE015cCC671b',
    sepoliaAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    icon: <ARBIcon />,
    decimals: 18,
  });

  const [currentTokenAddress, setCurrentTokenAddress] = useState<string>(() => {
    switch (chainId) {
      case sepolia.id:
        return tokenSelected.sepoliaAddress;
      case polygonAmoy.id:
        return tokenSelected.polygonAddress;
      default:
        return '';
    }
  });

  const { balance, loadingBalanceCustom, errorBalanceCustom } = useBalanceCustom(
    address as `0x${string}`,
    currentTokenAddress as `0x${string}`,
    decimals as number,
  );

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

  const handleRegularTokenButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsRegularTokenPopupOpen(true);
  };

  const handleCloseRegularTokenPopup = () => {
    setIsRegularTokenPopupOpen(false);
  };

  const handleOnSelect = (tokenSelected: IToken) => {
    setTokenSelected(tokenSelected);
    setIsRegularTokenPopupOpen(false);
    setTokenName(tokenSelected.name);
    setDecimals(tokenSelected.decimals);
  };

  const handleCustomTokenButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsCustomTokenPopupOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    const formData = new FormData(e.target as HTMLFormElement);
    const recipient = formData.get('recipient') as `0x${string}`;
    const parsedAmount = parseUnits(inputValue, decimals);
    writeContract({
      address: currentTokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, parsedAmount],
    });
  };

  useEffect(() => {
    let tokenAddress = '';
    switch (chainId) {
      case sepolia.id:
        tokenAddress = tokenSelected.sepoliaAddress;
        break;
      case polygonAmoy.id:
        tokenAddress = tokenSelected.polygonAddress;
        break;
      default:
        tokenAddress = '';
        break;
    }
    setCurrentTokenAddress(tokenAddress);
  }, [chainId, tokenSelected]);

  useEffect(() => {
    if (isConfirmed) {
      setIsTxFormSubmitted(true);
      setIsButtonActive(true);
      setIsTxSuccess(true);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isConfirming) {
      setIsButtonActive(false);
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isError !== null) {
      console.log('Error: ', isError);
      // TODO:
      setIsTxFormSubmitted(true);
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

  // сопостовление данных кастомного токена с данными стандартного токена
  useEffect(() => {
    if (tokenData) {
      setTokenSelected((prevToken) => ({
        ...prevToken,
        name: tokenData.tokenName || prevToken.name,
        polygonAddress: tokenData.tokenAddress || prevToken.polygonAddress,
        sepoliaAddress: tokenData.tokenAddress || prevToken.sepoliaAddress,
        decimals: tokenData.tokenDecimals || prevToken.decimals,
        icon: <NotFoundTokenLogo />,
      }));
    }
  }, [tokenData]);

  return (
    <>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        {isConfirming && (
          <div className={style.loader}>
            <BeatLoader
              color={'red'}
              loading={isConfirming}
              cssOverride={override}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
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
            <button className={style.availableTokensSelector} onClick={handleRegularTokenButtonClick} type="button">
              <div className={style.nameOfToken}>
                <span>{tokenSelected.icon}</span>
                <span>{tokenSelected.name}</span>
              </div>
              <div className={style.availableTokenArrowDown}>
                <ArrowDown />
              </div>
            </button>

            <button className={style.addCustomToken} type="button" onClick={handleCustomTokenButtonClick}>
              + Add a custom token
            </button>
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
        {isRegularTokenPopupOpen && <TokenPopup onCLose={handleCloseRegularTokenPopup} onSelect={handleOnSelect} />}
      </form>
    </>
  );
};

export default SendERC20SendForm;
