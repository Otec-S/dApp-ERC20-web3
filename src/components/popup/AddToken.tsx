import { Address, formatUnits, isAddress } from 'viem';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getToken } from '@wagmi/core';
import { getBalance, getAccount } from '@wagmi/core';
import { GetBalanceReturnType, GetTokenReturnType } from 'wagmi/actions';

import { config } from '../../../wagmiConfig';
import ClearIcon from '@assets/icons/clear_close_icon.svg';
import SuccessIcon from '@assets/icons/success.svg';

import styles from './AddToken.module.css';
import Warning from './Warning';
import TokenIcon from './TokenIcon';

export interface ITokenInfo {
  tokenAddress: Address | undefined;
  tokenName: string | undefined;
  tokenDecimals: number | undefined;
  tokenBalance: string | undefined;
}

interface IAddTokenProps {
  callback: (data:ITokenInfo)=>void;
}

interface IFormInputs {
  tokenId: string;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const AddToken: FC<IAddTokenProps> = ({ callback }: IAddTokenProps) => {
  const initialTokenDecimals = 18;
  const initialTokenName = '0x0000000000000000000000000000000000000000';
  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToAddState' | 'errorState'
  >('initialState');
  const [tokenBalance, setTokenBalance] = useState<string | undefined>(undefined);
  const [showLoader, setShowLoader] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<Address | undefined>(undefined);
  const [tokenName, setTokenName] = useState<string | undefined>(initialTokenName);
  const [tokenDecimals, setTokenDecimals] = useState(initialTokenDecimals);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();

  useEffect(() => {
    switch (formState) {
      case 'initialState':
        setTokenDecimals(initialTokenDecimals);
        setTokenName(initialTokenName);
        setTokenAddress(undefined);
        reset();
        break;
      case 'showTokenNameState':
        setShowLoader(true);
        getToken(config, {
          address: tokenAddress as Address,
        })
          .then((token: GetTokenReturnType) => {
            setTokenName(token.name ?? undefined);
            setTokenDecimals(token.decimals ?? undefined);
          })
          .then(() => {
            const account = getAccount(config);
            getBalance(config, {
              address: account.address as Address,
              token: tokenAddress,
            }).then((balanceData: GetBalanceReturnType) => {
              const balance = formatUnits(balanceData.value, 18);
              setTokenBalance(balance ?? undefined);
              setShowLoader(false);
            });
          })
          .catch((error) => {
            setShowLoader(false);
            console.error('Error: ' + error);
            setFormState('errorState');
          });
        break;
    }
  }, [formState, tokenAddress, reset]);

  const onHandlePreviosButton = () => {
    switch (formState) {
      case 'showTokenNameState':
        setFormState('initialState');
        reset();
        break;
      case 'showTokenAvatarState':
        setFormState('initialState');
        reset();
        break;
    }
  };

  const onHandleErrorButton = () => {
    setFormState('initialState');
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
    callback({ tokenAddress, tokenName, tokenDecimals, tokenBalance });
  };

  return (
    <div className={styles.addToken}>
      {showLoader && (
        <div className={styles.loader}>
          <BeatLoader
            color={'red'}
            loading={showLoader}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      {formState !== 'errorState' && (
        <div className={styles.headerWrapper}>
          <h5 className={styles.header}>
            {formState !== 'readyToAddState' ? 'Add a custom token' : 'Successful import'}
          </h5>
          <button className={styles.closeForm} onPointerDown={handleCloseForm}>
            <ClearIcon/>
          </button>
        </div>
      )}
      {formState !== 'readyToAddState' && formState !== 'errorState' && (
        <Warning warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks" />
      )}

      {formState !== 'readyToAddState' && formState !== 'errorState' && (
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

            {formState === 'showTokenAvatarState' && (
              <TokenIcon
                tokenAddress={tokenAddress as Address}
                tokenDecimals={tokenDecimals}
                tokenName={tokenName ?? ''}
                tokenBalance={tokenBalance}
              />
            )}
          </div>
          <div className={styles.buttonWrapper}>
            {formState !== 'initialState' && (
              <button onPointerDown={onHandlePreviosButton} className={styles.button} type="button">
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
        <>
          <div className={styles.successLogoWrapper}>
            <SuccessIcon/>
            <span className={styles.successLogoText}>{tokenName + ' token has been added'}</span>
          </div>
          <button onPointerDown={handleCloseForm} className={styles.button} type="button">
            Okay
          </button>
        </>
      )}
      {formState === 'errorState' && (
        <>
          <div className={styles.successLogoWrapper}>
            <h5 className={styles.header}>Something went wrong. Pls check network and token address.</h5>
          </div>
          <button onPointerDown={onHandleErrorButton} className={styles.button} type="button">
            Okay
          </button>
        </>
      )}
    </div>
  );
};

export default AddToken;
