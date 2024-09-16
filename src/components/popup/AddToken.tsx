import { Address, isAddress } from 'viem';
import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAccount, useToken } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import close from '../../assets/images/clear_close_icon.svg';
import defaultTokenLogo from '../../assets/images/token_logo.svg';
import styles from './AddToken.module.css';
import Warning from './Warning';
import { tokens } from '../../assets/constants';

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
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'sendedState'
  >('initialState');
  const [tokenAddress, setTokenAddress] = useState<Address>(initialTokenAddress);
  const [tokenName, setTokenName] = useState(initialTokenName);
  const [tokenDecimals, setTokenDecimals] = useState(initialTokenDecimals);
  const { isConnected } = useAccount()
  console.log(isConnected);
  const { openConnectModal } = useConnectModal();
  if(!isConnected && openConnectModal){
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
      case 'sendedState':
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
        setFormState('sendedState');
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
              {errors.tokenId?.type === 'validate' && (
                <span className={styles.error}>This input is not token address</span>
              )}
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
          <div className={styles.tokenImgWrapper}>
            <img className={styles.tokenImg} src={tokens.find((t)=>(t.polygonAddress === tokenAddress)||(t.sepoliaAddress === tokenAddress))?.iconPath ?? defaultTokenLogo} alt="token logo" />
            <div className={styles.imgTextWrapper}>
              <span className={styles.tokenNameHeader}>{tokenName}</span>
            </div>
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
