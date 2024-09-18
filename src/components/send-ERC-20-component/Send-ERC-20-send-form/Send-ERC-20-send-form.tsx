import { FC, useEffect, useState } from 'react';
import style from './Send-ERC-20-send-form.module.css';
import balanceMaxSign from '../../../assets/balanceMaxSign.svg';
import USDTLogo from '../../../assets/USDTLogo.svg';
import arrow_down from '../../../assets/arrow_down.svg';
import BalanceDisplay from '../../balance-display/balance-display';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import SubmitButton from '../../../UI/submit-button/Submit-button';

interface ISendERC20SendFormProps {
  setIsButtonActive?: (value: boolean) => void;
  isSuccess: boolean;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({ isSuccess }) => {
  const [inputValue, setInputValue] = useState('0');
  const [recipientValue, setRecipientValue] = useState('');

  const [isButtonActive, setIsButtonActive] = useState(true);

  // const balance = 5800;
  // const formattedBalance = balance.toLocaleString('en-US');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const value = parseFloat(event.target.value);
    // setInputValue(isNaN(value) ? 0 : value);
    setInputValue(event.target.value);
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientValue(event.target.value);
  };

  const { data: hash, sendTransaction } = useSendTransaction();

  // TODO: Implement submitTocken function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('recipient') as `0x${string}`;
    const value = formData.get('value') as string;
    sendTransaction({ to, value: parseEther(value) });
  };

  useEffect(() => {
    if (setIsButtonActive) {
      setIsButtonActive(inputValue.length > 0 && recipientValue.length > 0);
    }
  }, [inputValue, recipientValue, setIsButtonActive]);

  return (
    <>
      <form className={style.blockForm} onSubmit={handleSubmit}>
        <div className={style.sender}>
          <div className={style.inputBlock}>
            <input
              name="value"
              className={style.input}
              type="string"
              // step="any"
              value={inputValue}
              onChange={handleInputChange}
              required
            />
            <div className={style.balance}>
              <div className={style.balanceValue}>
                Balance <BalanceDisplay />
              </div>
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
