import { FC, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { erc20Abi } from 'viem';
import { BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ArrowDown from '@assets/icons/arrow_down.svg';
import BalanceMaxSign from '@assets/icons/balanceMaxSign.svg';
import USDTLogo from '@assets/icons/USDTLogo.svg';

import useBalanceCustom from '../../../hooks/useBalanceCustom';
import SubmitButton from '../../../UI/submit-button/Submit-button';
import style from './Send-ERC-20-send-form.module.css';

interface ISendERC20SendFormProps {
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
  setIsTxSuccess: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  token: `0x${string}`;
  decimals: number;
}

const SendERC20SendForm: FC<ISendERC20SendFormProps> = ({
  setIsTxSuccess,
  setIsTxFormSubmitted,
  inputValue,
  setInputValue,
  token,
  decimals,
}) => {
  const [recipientValue, setRecipientValue] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(true);

  const [amountError, setAmountError] = useState<string | null>(null);

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const { address } = useAccount();

  const { balance, loadingBalanceCustom, errorBalanceCustom } = useBalanceCustom(
    address as `0x${string}`,
    token as `0x${string}`,
    decimals as number,
  );

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    const formData = new FormData(e.target as HTMLFormElement);
    const recipient = formData.get('recipient') as `0x${string}`;
    // const amount = formData.get('value') as string;
    // const tokenAddress = '0xf300c9bf1A045844f17B093a6D56BC33685e5D05';
    // TODO: decimals должны сюда передаваться
    const parsedAmount = parseUnits(inputValue, 18);
    writeContract({
      address: token,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, parsedAmount],
    });
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
            {amountError && <div className={style.balanceExceededError}>{amountError}</div>}
          </div>

          <div className={style.tokenBlock}>
            <div className={style.availableTokensSelector}>
              <div className={style.nameOfToken}>
                <div className={style.availableTokenLogo}>
                  <USDTLogo />
                </div>
              </div>

              <div className={style.availableTokenArrowDown}>
                <ArrowDown />
              </div>
            </div>

            <div className={style.addCustomToken}>+ Add a custom token</div>
          </div>
        </div>
        <div className={style.recipient}>
          <input
            name="recipient"
            className={style.recipientInput}
            placeholder="0x0000000000000000000000000000000000000000"
            // value={recipientValue}
            onChange={handleRecipientChange}
            required
          />
        </div>
        {/* {hash && <p className={style.transactionHash}>Transaction Hash: {hash}</p>} */}
        <SubmitButton buttonText="Send" isButtonActive={isButtonActive} disabled={!isButtonActive} />
        {/* {isPending ? <h3 style={{ color: 'blue' }}>'Confirming...'</h3> : <h3 style={{ color: 'green' }}>'Done'</h3>} */}
        {/* {error && <h3 style={{ color: 'white' }}>Error: {(error as BaseError).shortMessage || error.message}</h3>} */}
      </form>
    </>
  );
};

export default SendERC20SendForm;
