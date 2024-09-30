import { CSSProperties, FC, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { Address, formatUnits, parseUnits } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ARBIcon from '@assets/icons/arb.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import BalanceMaxSign from '@assets/icons/balanceMaxSign.svg';
import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';
import FormButton from '@src/components/form-button/FormButton';
import { TokenPopup } from '@src/components/TokenPopup/TokenPopup';
import { Token, TokenData } from '@src/shared/constants';
import { erc20abiExtended } from '@src/shared/erc20abi-extended';

import style from './Send-ERC-20-send-form.module.css';

interface Props {
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  setTokenName: (value: string) => void;
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  tokenData: TokenData | null;
}

const SendERC20SendForm: FC<Props> = ({
  setIsTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  setTokenName,
  setIsCustomTokenPopupOpen,
  tokenData,
}) => {
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

  const { data: hash, error: isWriteError, writeContract } = useWriteContract();

  const { address } = useAccount(); // адрес кошелька

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const chainId = useChainId();

  const [tokenSelected, setTokenSelected] = useState<Token>({
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

  // получение баланса кошелька
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: errorBalance,
  } = useReadContract({
    abi: erc20abiExtended,
    address: currentTokenAddress as Address,
    functionName: 'balanceOf',
    args: [address as Address],
  });

  const balanceWithDecimals = formatUnits(BigInt(balanceData ?? 0), decimals);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Валидация поля ввода
    const inputValueRegex = /^\d*\.?\d*$/;
    if (inputValueRegex.test(value)) {
      setInputValue(value);
      if (balanceWithDecimals && parseFloat(value) > parseFloat(balanceWithDecimals)) {
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

  const handleOnSelect = (tokenSelected: Token) => {
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
    const formData = new FormData(e.target as HTMLFormElement);
    const recipient = formData.get('recipient') as Address;
    const parsedAmount = parseUnits(inputValue, decimals);
    writeContract({
      address: currentTokenAddress as Address,
      abi: erc20abiExtended,
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
    if (isWriteError !== null) {
      setIsTxFormSubmitted(true);
      setIsTxSuccess(false);
    }
  }, [isWriteError]);

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
                {isLoadingBalance ? (
                  <span>Loading...</span>
                ) : errorBalance ? (
                  <span>Error getting wallet balance</span>
                ) : (
                  <span>Balance: {balanceWithDecimals}</span>
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
        <FormButton buttonText="Send" isButtonActive={isButtonActive} disabled={!isButtonActive} />
        {isRegularTokenPopupOpen && <TokenPopup onCLose={handleCloseRegularTokenPopup} onSelect={handleOnSelect} />}
      </form>
    </>
  );
};

export default SendERC20SendForm;
