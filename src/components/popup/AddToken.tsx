import { Address, isAddress } from 'viem';
import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAccount, useToken } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import close from '../../assets/images/clear_close_icon.svg';
import styles from './AddToken.module.css';
import Warning from './Warning';
import { TokenIcon } from './TokenIcon';

export interface ITokenInfo {
  tokenAddress: Address | undefined;
  tokenName: string | undefined;
  tokenDecimals: number | undefined;
}

export interface IAddTokenType {
  handleClose: (data: ITokenInfo) => void;
}

interface IFormInputs {
  tokenId: string;
}

const AddToken: FC<IAddTokenType> = ({ handleClose }: IAddTokenType) => {
  const initialTokenAddress = '0x0000000000000000000000000000000000000000' as Address;
  const initialTokenName = '0x0000000000000000000000000000000000000000';
  const initialTokenDecimals = 18;

  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'successfullState'
  >('initialState');
  const [tokenAddress, setTokenAddress] = useState<Address>(initialTokenAddress);
  const [tokenName, setTokenName] = useState(initialTokenName);
  const [tokenDecimals, setTokenDecimals] = useState(initialTokenDecimals);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const token = useToken({
    address: tokenAddress,
  });

  useEffect(() => {
    if (formState === 'initialState') {
      setTokenDecimals(initialTokenDecimals);
      setTokenName(initialTokenName);
    } else if (formState === 'showTokenNameState') {
      setTokenName(token.data?.name ?? initialTokenName);
      setTokenDecimals(token.data?.decimals ?? initialTokenDecimals);
    }
  }, [formState, token.data?.name, token.data?.decimals]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();

  const handlePreviosButton = () => {
    switch (formState) {
      case 'showTokenNameState':
        setFormState('initialState');
        reset();
        break;
      case 'showTokenAvatarState':
        setFormState('showTokenNameState');
        break;
    }
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    switch (formState) {
      case 'initialState':
        setTokenAddress(data.tokenId as Address);
        setFormState('showTokenNameState');
        break;
      case 'showTokenNameState':
        setFormState('showTokenAvatarState');
        break;
      case 'showTokenAvatarState':
        setFormState('successfullState');
        break;
    }
    console.log(data);
  };

  const handleCloseForm = () => {
    handleClose({ tokenAddress, tokenName, tokenDecimals });
  }

  return (
    <div className={styles.addToken}>
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>
          {formState !== 'successfullState' ? 'Add a custom token' : 'Successful import'}
        </h5>
        <button className={styles.closeForm} onPointerDown={handleCloseForm}>
          <img className={styles.close} src={close} alt="close" />
        </button>
      </div>
      {formState !== 'successfullState' && (
        <Warning warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks" />
      )}

      {formState !== 'successfullState' && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            {formState !== 'showTokenAvatarState' && (
              <>
                <label className={styles.inputLabel}>
                  Token contract address
                  <input
                    disabled={formState !== 'initialState'}
                    className={styles.inputAddress}
                    defaultValue=""
                    {...register('tokenId', { required: true, validate: (value) => isAddress(value) })}
                  />
                  {errors.tokenId?.type === 'required' && <span className={styles.error}>This field is required</span>}
                  {errors.tokenId?.type === 'validate' && (
                    <span className={styles.error}>This input is not token address</span>
                  )}
                </label>
                <label className={styles.inputLabel}>
                  Token contract name
                  <input type="text" value={tokenName} className={styles.inputName} readOnly />
                </label>
                <div>
                  <label className={styles.inputLabel}>
                    Token contract decimals
                    <input type="text" value={tokenDecimals} className={styles.inputDecimals} readOnly />
                  </label>
                </div>
              </>
            )}

            {formState === 'showTokenAvatarState' && <TokenIcon tokenAddress={tokenAddress} />}
          </div>
          <div className={styles.buttonWrapper}>
            {formState !== 'initialState' && (
              <button onPointerDown={handlePreviosButton} className={styles.button} type="button">
                Back
              </button>
            )}
            <button className={styles.button} type="submit">
              {' '}
              Next{' '}
            </button>
          </div>
        </form>
      )}
      {formState === 'successfullState' && (
        <button onPointerDown={handleCloseForm} className={styles.button} type="button">
          Okay
        </button>
      )}
    </div>
  );
};

export default AddToken;
