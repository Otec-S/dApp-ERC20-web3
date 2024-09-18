import { FC, useEffect, useState } from 'react';
import style from './Send-ERC-20-send-form.module.css';
import balanceMaxSign from '../../../assets/balanceMaxSign.svg';
import ETHLogo from '../../../assets/ETHLogo.svg';
import arrow_down from '../../../assets/arrow_down.svg';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import SubmitButton from '../../../UI/submit-button/Submit-button';
import useBalanceCustom from '../../../hooks/useBalanceCustom';

interface ISendERC20SendFormProps {
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({
  setIsTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
}) => {
  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);

  const [amountError, setAmountError] = useState<string | null>(null);

  const { data: hash, sendTransaction } = useSendTransaction();

  const { address } = useAccount();
  const { balance, loadingBalanceCustom, errorBalanceCustom } = useBalanceCustom(address as `0x${string}`);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (balance && parseFloat(value) > parseFloat(balance)) {
      setAmountError('The amount exceeds your balance');
    } else {
      setAmountError(null);
    }
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientValue(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (amountError) {
      return;
    }

    console.log('Form submitted');
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('recipient') as `0x${string}`;
    const value = formData.get('value') as string;
    sendTransaction({ to, value: parseEther(value) });
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

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
      setIsButtonActive(inputValue.length > 0 && inputValueNumber > 0 && recipientValue.length > 0 && !amountError);
    }
  }, [inputValue, recipientValue, setIsButtonActive, amountError]);

  return (
    <>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        <div className={style.sender}>
          <div className={style.inputBlock}>
            <input
              name="value"
              className={style.input}
              type="string"
              value={inputValue}
              onChange={handleInputChange}
              required
            />
            <div className={style.balance}>
              <div className={style.balanceValue}>
                {loadingBalanceCustom ? (
                  <span>Loading...</span>
                ) : errorBalanceCustom ? (
                  <span>Error: {errorBalanceCustom.message}</span>
                ) : (
                  <span>Balance: {balance}</span>
                )}
              </div>
              <img src={balanceMaxSign} alt="Max balance icon" />
            </div>
            {amountError && <div className={style.balanceExceededError}>{amountError}</div>}
          </div>

          <div className={style.tokenBlock}>
            <div className={style.availableTokensSelector}>
              <div className={style.nameOfToken}>
                <img className={style.availableTokenLogo} src={ETHLogo} alt="Current token icon" />
                <span>ETH</span>
              </div>

              <img className={style.availableTokenArrowDown} src={arrow_down} alt="Down arrow icon" />
            </div>

            <div className={style.addCustomToken}>+ Add a custom token</div>
          </div>
        </div>
        <div className={style.recipient}>
          <input
            name="recipient"
            className={style.recipientInput}
            placeholder="0x0000000000000000000000000000000000000000"
            value={recipientValue}
            onChange={handleRecipientChange}
            required
          />
        </div>
        {hash && <p className={style.transactionHash}>Transaction Hash: {hash}</p>}
        <SubmitButton buttonText="Send" isButtonActive={isButtonActive} />
      </form>
    </>
  );
};

export default SendERC20SendForm;
