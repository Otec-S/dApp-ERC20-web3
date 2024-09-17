import { Address, isAddress } from 'viem';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import BeatLoader from "react-spinners/BeatLoader";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getToken } from '@wagmi/core';

import close from '../../assets/images/clear_close_icon.svg';
import { config } from '../../../wagmiConfig';
import styles from './AddToken.module.css';
import Warning from './Warning';
import { TokenIcon } from './TokenIcon';

export interface ITokenInfo {
  tokenAddress: Address | undefined;
  tokenName: string | undefined;
  tokenDecimals: number | undefined;
}

export interface IAddTokenType {
  callback: (data: ITokenInfo) => void;
}

interface IFormInputs {
  tokenId: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "100px auto",
};

const AddToken: FC<IAddTokenType> = ({ callback }: IAddTokenType) => {
  const initialTokenAddress = '0x0000000000000000000000000000000000000000' as Address;
  const initialTokenName = '0x0000000000000000000000000000000000000000';
  const initialTokenDecimals = 18;

  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToAddState'
  >('initialState');
  const [showLoader, setShowLoader ] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<Address>(initialTokenAddress);
  const [tokenName, setTokenName] = useState(initialTokenName);
  const [tokenDecimals, setTokenDecimals] = useState(initialTokenDecimals);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  useEffect(() => {
    if (formState === 'initialState') {
      setTokenDecimals(initialTokenDecimals);
      setTokenName(initialTokenName);
    } else if (formState === 'showTokenNameState') {
      setShowLoader(true);
      const fetchTokenData = async () => {
        try {
          const token = await getToken(config, {
          address: tokenAddress,
        });
        setTokenName(token.name ?? initialTokenName);
        setTokenDecimals(token.decimals ?? initialTokenDecimals);
        } catch (error) {
          console.error('Error getting token: '+error);
          setShowLoader(false);
        }
        setShowLoader(false);
      }
      fetchTokenData();
    }
  }, [formState,tokenAddress]);

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
        setFormState('readyToAddState');
        break;
    }
  };

  const handleCloseForm = () => {
    callback({ tokenAddress, tokenName, tokenDecimals });
  }

  return (
    <div className={styles.addToken}>
      {
        showLoader && <div className={styles.loader}>
        <BeatLoader
        color={'red'}
        loading={showLoader}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div> 
      }
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>
          {formState !== 'readyToAddState' ? 'Add a custom token' : 'Successful import'}
        </h5>
        <button className={styles.closeForm} onPointerDown={handleCloseForm}>
          <img className={styles.close} src={close} alt="close" />
        </button>
      </div>
      {formState !== 'readyToAddState' && (
        <Warning warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks" />
      )}

      {formState !== 'readyToAddState' && (
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

            {formState === 'showTokenAvatarState' && <TokenIcon tokenAddress={tokenAddress} tokenDecimals={tokenDecimals} tokenName={tokenName}/>}
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
      {formState === 'readyToAddState' && (
        <button onPointerDown={handleCloseForm} className={styles.button} type="button">
          Okay
        </button>
      )}
    </div>
  );
};

export default AddToken;
