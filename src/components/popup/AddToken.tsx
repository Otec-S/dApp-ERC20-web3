import { Address, isAddress } from 'viem';
import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useToken } from 'wagmi';

import close from '../../assets/images/clear_close_icon.svg';
import tokenLogo from '../../assets/images/token_logo.svg';
import styles from './AddToken.module.css';
import Warning from './Warning';

interface IAddTokenType {
  handleClose: () => void;
}

interface IFormInputs {
  tokenId: string;
}

const AddToken: FC<IAddTokenType> = ({ handleClose }: IAddTokenType) => {
  const initialTokenAddress = '0x0000000000000000000000000000000000000000' as Address;
  const initialTokenName = '0x0000000000000000000000000000000000000000';
  const initialTokenDecimals = 18;
  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToSendFormState'
  >('initialState');
  const [tokenAddress, setTokenAddress] = useState<Address>(initialTokenAddress);
  const [tokenName, setTokenName] = useState(initialTokenName);
  const [tokenDecimals, setTokenDecimals] = useState(initialTokenDecimals);
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
      case 'readyToSendFormState':
        setFormState('showTokenAvatarState');
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
        setFormState('readyToSendFormState');
        break;
    }
    console.log(data);
  };

  return (
    <div className={styles.addToken}>
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>Add a custom token</h5>
        <button className={styles.closeForm} onPointerDown={handleClose}>
          <img className={styles.close} src={close} alt="close" onPointerDown={handleClose} />
        </button>
      </div>
      <Warning warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks" />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

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
          {errors.tokenId?.type === 'validate' && <span className={styles.error}>This input is not token address</span>}
        </label>
        <div>
          <label className={styles.inputLabel}>
            Token contract name
            <input type="text" value={tokenName} className={styles.inputName} readOnly />
          </label>
        </div>
        <div>
          <label className={styles.inputLabel}>
            Token contract decimals
            <input type="text" value={tokenDecimals} className={styles.inputDecimals} readOnly />
          </label>
        </div>
        </>
        )}

        {formState === 'showTokenAvatarState' && (
          <div>
            <img src={tokenLogo} alt="token logo" />
            <span>{tokenName}</span>
          </div>
        )}

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
    </div>
  );
};

export default AddToken;
