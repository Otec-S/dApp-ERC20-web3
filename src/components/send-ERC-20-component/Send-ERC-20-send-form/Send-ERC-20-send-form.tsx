import { FC, useEffect, useState } from 'react';
import style from './Send-ERC-20-send-form.module.css';
import balanceMaxSign from '../../../assets/balanceMaxSign.svg';
// import USDTLogo from '../../../assets/USDTLogo.svg';
import ETHLogo from '../../../assets/ETHLogo.svg';
import arrow_down from '../../../assets/arrow_down.svg';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import SubmitButton from '../../../UI/submit-button/Submit-button';
import useBalanceCustom from '../../../hooks/useBalanceCustom';

interface ISendERC20SendFormProps {
  setIsButtonActive?: (value: boolean) => void;
  isSuccess: boolean;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({ isSuccess }) => {
  const [inputValue, setInputValue] = useState('0');
  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);

  const [amountError, setAmountError] = useState<string | null>(null);

  // const balance = 5800;
  // const formattedBalance = balance.toLocaleString('en-US');

  const address: `0x${string}` = '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054';
  const { balance, loading, error } = useBalanceCustom(address);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const value = parseFloat(event.target.value);
    // setInputValue(isNaN(value) ? 0 : value);
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

  const { data: hash, sendTransaction } = useSendTransaction();

  // TODO: Implement submitTocken function
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
                {loading ? (
                  <span>Loading...</span>
                ) : error ? (
                  <span>Error: {error.message}</span>
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
        {hash && <div>Transaction Hash: {hash}</div>}
        <SubmitButton buttonText={isSuccess ? 'Great!' : 'Start again'} isButtonActive={isButtonActive} />
      </form>
    </>
  );
};

export default SendERC20SendForm;
