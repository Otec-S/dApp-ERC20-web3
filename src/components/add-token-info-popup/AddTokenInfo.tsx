import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address, isAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import ClearIcon from '@assets/icons/clear_close_icon.svg';
import SuccessIcon from '@assets/icons/success.svg';
import { TokenData } from '@src/shared/constants';
import { erc20abiExtended } from '@src/shared/constants/erc20abi-extended';

import FormButton from '../form-button/FormButton';
import TokenInfo from './TokenInfo';
import Warning from './Warning';
import styles from './AddTokenInfo.module.css';

type FormStages = 'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToAddState' | 'errorState';

interface Props {
  colorScheme?: 'default' | 'yellow';
  onClose: (data: TokenData) => void;
}

interface FormData {
  tokenAddress: Address;
  tokenName?: string;
  tokenDecimals?: number;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const AddTokenInfo: FC<Props> = ({ colorScheme = 'default', onClose }) => {
  const [formState, setFormState] = useState<FormStages>('initialState');
  const [tokenAddress, setTokenAddress] = useState<Address | undefined>(undefined);

  const { isConnected, address: walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const {
    data: contractData,
    isLoading: isLoadingContacts,
    isSuccess,
    isError,
  } = useReadContracts({
    allowFailure: false,
    contracts: walletAddress && [
      {
        address: tokenAddress,
        functionName: 'decimals',
        abi: erc20abiExtended,
      },
      {
        address: tokenAddress,
        functionName: 'name',
        abi: erc20abiExtended,
      },
      {
        address: tokenAddress,
        functionName: 'balanceOf',
        abi: erc20abiExtended,
        args: [walletAddress],
      },
    ],
  });

  useEffect(() => {
    switch (formState) {
      case 'initialState':
        reset();
        setTokenAddress(undefined);
        break;
      case 'showTokenNameState':
        if (isError) {
          setFormState('errorState');
        }
        if (isSuccess) {
          setValue('tokenDecimals', contractData[0]);
          setValue('tokenName', contractData[1]);
        }
        break;
    }
  }, [formState, tokenAddress, reset, setValue, isError, contractData, getValues, isSuccess]);

  const onHandlePreviosButton = () => {
    switch (formState) {
      case 'showTokenNameState':
        setFormState('initialState');
        break;
      case 'showTokenAvatarState':
        setFormState('initialState');
        break;
    }
  };

  const onHandleNextButton = () => {
    switch (formState) {
      case 'showTokenNameState':
        setFormState('showTokenAvatarState');
        break;
      case 'showTokenAvatarState':
        setFormState('readyToAddState');
        break;
    }
  };

  const onHandleErrorButton = () => {
    setFormState('initialState');
  };

  const onSubmit: SubmitHandler<FormData> = () => {
    setTokenAddress(getValues('tokenAddress'));
    switch (formState) {
      case 'initialState':
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
    onClose({
      tokenAddress,
      tokenName: contractData?.[1],
      tokenDecimals: contractData?.[0],
      tokenBalance: contractData?.[2],
      requestWasSuccessful: isSuccess,
    });
  };

  const handleEscDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose({ requestWasSuccessful: false });
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onClose({ requestWasSuccessful: false });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscDown);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleEscDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container" ref={popupRef}>
      <div className={cn(styles.addToken, { [styles.addTokenYellowScheme]: colorScheme === 'yellow' })}>
        {isLoadingContacts && (
          <div className={styles.loader}>
            <BeatLoader
              color={'red'}
              loading={isLoadingContacts}
              cssOverride={override}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        {formState !== 'errorState' && (
          <div className={cn(styles.headerWrapper, { [styles.headerWrapperYellow]: colorScheme === 'yellow' })}>
            <h5 className={styles.header}>
              {formState !== 'readyToAddState' ? 'Add a custom token' : 'Successful import'}
            </h5>
            <button
              className={cn(styles.closeForm, { [styles.closeFormYellowScheme]: colorScheme === 'yellow' })}
              onPointerDown={handleCloseForm}
            >
              <ClearIcon />
            </button>
          </div>
        )}
        <div className={cn(styles.formWrapper, { [styles.formWrapperYellowScheme]: colorScheme === 'yellow' })}>
          {formState !== 'readyToAddState' && formState !== 'errorState' && (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Warning
                colorScheme={colorScheme}
                warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks"
              />
              <div>
                {formState !== 'showTokenAvatarState' && (
                  <>
                    <label className={styles.inputLabel}>
                      Token contract address
                      <input
                        disabled={formState !== 'initialState'}
                        className={cn(styles.inputAddress, {
                          [styles.inputAddressYellowScheme]: colorScheme === 'yellow',
                          [styles.inputAddressError]: errors.tokenAddress,
                          [styles.inputAddressErrorYellowScheme]: errors.tokenAddress && colorScheme === 'yellow',
                        })}
                        {...register('tokenAddress', { required: true, validate: (value) => isAddress(value) })}
                      />
                      {errors.tokenAddress?.type === 'required' && (
                        <span className={styles.error}>This field is required</span>
                      )}
                      {errors.tokenAddress?.type === 'validate' && (
                        <span className={styles.error}>This input is not token address</span>
                      )}
                    </label>
                    <label className={styles.inputLabel}>
                      Token contract name
                      <input
                        defaultValue="0x0000000000000000000000000000000000000000"
                        {...register('tokenName')}
                        type="text"
                        className={cn(styles.inputName, {
                          [styles.inputNameYellowScheme]: colorScheme === 'yellow',
                        })}
                        readOnly
                      />
                    </label>
                    <div>
                      <label className={styles.inputLabel}>
                        Token contract decimals
                        <input
                          type="text"
                          {...register('tokenDecimals')}
                          defaultValue={18}
                          className={cn(styles.inputDecimals, {
                            [styles.inputDecimalsYellowScheme]: colorScheme === 'yellow',
                          })}
                          readOnly
                        />
                      </label>
                    </div>
                  </>
                )}

                {formState === 'showTokenAvatarState' && (
                  <TokenInfo
                    colorScheme={colorScheme}
                    tokenAddress={tokenAddress}
                    tokenDecimals={contractData?.[0]}
                    tokenBalance={contractData?.[2]}
                    tokenName={contractData?.[1]}
                  />
                )}
              </div>
              <div className={styles.buttonWrapper}>
                {formState !== 'initialState' && (
                  <FormButton colorScheme={colorScheme} buttonText="Back" onPointerDown={onHandlePreviosButton} />
                )}
                {formState !== 'initialState' && (
                  <FormButton
                    onPointerDown={onHandleNextButton}
                    colorScheme={colorScheme}
                    buttonText="Next"
                    type="button"
                  />
                )}
                {formState === 'initialState' && (
                  <FormButton colorScheme={colorScheme} buttonText="Next" type="submit" />
                )}
              </div>
            </form>
          )}
          {formState === 'readyToAddState' && (
            <>
              <div
                className={cn(styles.successLogoWrapper, {
                  [styles.successLogoWrapperYellowScheme]: colorScheme === 'yellow',
                })}
              >
                <SuccessIcon />
                <span
                  className={cn(styles.successLogoText, {
                    [styles.successLogoTextYellowScheme]: colorScheme === 'yellow',
                  })}
                >
                  {`${getValues('tokenName')} token has been added`}
                </span>
              </div>
              <FormButton colorScheme={colorScheme} onPointerDown={handleCloseForm} buttonText="Okay" type="button" />
            </>
          )}
          {formState === 'errorState' && (
            <>
              <div
                className={cn(styles.successLogoWrapper, {
                  [styles.successLogoWrapperYellowScheme]: colorScheme === 'yellow',
                })}
              >
                <h5 className={styles.header}>Something went wrong. Pls check network and token address.</h5>
              </div>
              <FormButton colorScheme={colorScheme} onPointerDown={onHandleErrorButton} buttonText="Back" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTokenInfo;
