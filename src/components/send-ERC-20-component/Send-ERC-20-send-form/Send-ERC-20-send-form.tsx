import { CSSProperties, FC, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { Address, formatUnits, getAddress, parseUnits } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ARBIcon from '@assets/icons/arb.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import BalanceMaxSign from '@assets/icons/balanceMaxSign.svg';
import FormButton from '@src/components/form-button/FormButton';
import { TokenPopup } from '@src/components/TokenPopup/TokenPopup';
import { Token, TokenData } from '@src/shared/constants';
import { erc20abiExtended } from '@src/shared/constants/erc20abi-extended';
import getTokenIcon from '@src/utils/getTokenIcon';

import style from './Send-ERC-20-send-form.module.css';

interface Props {
  inputValue: string;
  tokenData: TokenData | null;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  setInputValue: (value: string) => void;
  setTokenName: (value: string) => void;
  setIsCustomTokenPopupOpen: (value: boolean) => void;
  setTxHash: (value: Address) => void;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const SendERC20SendForm: FC<Props> = ({
  inputValue,
  tokenData,
  setIsTxSuccess,
  setIsTxFormSubmitted,
  setInputValue,
  setTokenName,
  setIsCustomTokenPopupOpen,
  setTxHash,
}) => {
  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [inputValueError, setInputValueError] = useState<string | null>(null);
  const [inputRecipientError, setInputRecipientError] = useState<string | null>(null);
  const [isRegularTokenPopupOpen, setIsRegularTokenPopupOpen] = useState(false);
  const { data: hash, error: isWriteError, writeContract } = useWriteContract();
  const { address } = useAccount();
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

  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>(() => {
    switch (chainId) {
      case sepolia.id:
        return tokenSelected.sepoliaAddress;
      case polygonAmoy.id:
        return tokenSelected.polygonAddress;
      default:
        return '0x';
    }
  });

  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: errorBalance,
  } = useReadContract(
    address && {
      abi: erc20abiExtended,
      address: currentTokenAddress,
      functionName: 'balanceOf',
      args: [address],
      query: { refetchInterval: 600000 },
    },
  );

  const balanceWithDecimals = balanceData && formatUnits(BigInt(balanceData), tokenSelected.decimals);

  const handleNumberOfTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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
  };

  const handleCustomTokenButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsCustomTokenPopupOpen(true);
  };

  const handleBalanceMaxClick = () => {
    if (balanceWithDecimals) {
      setInputValue(balanceWithDecimals);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const recipientValue = formData.get('recipient');

    if (typeof recipientValue === 'string') {
      const recipient = getAddress(recipientValue);
      const parsedAmount = parseUnits(inputValue, tokenSelected.decimals);
      writeContract({
        address: currentTokenAddress,
        abi: erc20abiExtended,
        functionName: 'transfer',
        args: [recipient, parsedAmount],
      });
    } else {
      console.error('Invalid recipient address');
    }
  };

  useEffect(() => {
    setCurrentTokenAddress(() => {
      switch (chainId) {
        case sepolia.id:
          return tokenSelected.sepoliaAddress;
        case polygonAmoy.id:
          return tokenSelected.polygonAddress;
        default:
          return '0x';
      }
    });
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
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

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

  useEffect(() => {
    if (tokenData) {
      setTokenSelected((prevToken) => ({
        ...prevToken,
        name: tokenData.tokenName || prevToken.name,
        polygonAddress: tokenData.tokenAddress || prevToken.polygonAddress,
        sepoliaAddress: tokenData.tokenAddress || prevToken.sepoliaAddress,
        decimals: tokenData.tokenDecimals || prevToken.decimals,
        icon: getTokenIcon(tokenData.tokenAddress as Address),
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
              onChange={handleNumberOfTokensInputChange}
              required
            />
            <div className={style.balance}>
              <div className={style.balanceValue}>
                {isLoadingBalance ? (
                  <span>Loading...</span>
                ) : errorBalance ? (
                  <span>Error getting wallet balance</span>
                ) : (
                  <span>Balance: {balanceWithDecimals || '0'}</span>
                )}
              </div>
              <button className={style.balanceMax} type="button" onClick={handleBalanceMaxClick}>
                <BalanceMaxSign />
              </button>
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
        {isRegularTokenPopupOpen && (
          <div className={style.overlay}>
            <TokenPopup onCLose={handleCloseRegularTokenPopup} onSelect={handleOnSelect} />
          </div>
        )}
      </form>
    </>
  );
};

export default SendERC20SendForm;
