import { CSSProperties, FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import cn from 'classnames';
import { Address, formatUnits, isAddress } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, useReadContracts } from 'wagmi';

import ClearIcon from '@assets/icons/clear_close_icon.svg';
import SuccessIcon from '@assets/icons/success.svg';

import FormButton from '../form-button/FormButton';
import TokenInfo from './TokenInfo';
import Warning from './Warning';
import styles from './AddTokenInfo.module.css';

interface ITokenInfo {
  requestWasSuccessful: boolean;
  tokenAddress?: Address;
  tokenName?: string | undefined;
  tokenDecimals?: number | undefined;
  tokenBalance?: string | undefined;
}

interface Props {
  onClosePopup: (data: ITokenInfo) => void;
  colorScheme?: 'default' | 'yellow';
}

interface IFormInputs {
  tokenAddress: string;
  tokenName: string;
  tokenDecimals: number;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const AddTokenInfo: FC<Props> = ({ onClosePopup, colorScheme = 'default' }) => {
  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToAddState' | 'errorState'
  >('initialState');
  const [tokenBalance, setTokenBalance] = useState<string | undefined>(undefined);
  const [showLoader, setShowLoader] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<Address | undefined>(undefined);
  const [tokenName, setTokenName] = useState<string | undefined>(undefined);
  const [tokenDecimals, setTokenDecimals] = useState<number | undefined>(undefined);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState(false);

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();

  const { data: contractData, isLoading: isLoadingContacts, isError:contractError } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        functionName: 'decimals',
        abi: erc20Abi,
      },
      {
        address: tokenAddress,
        functionName: 'name',
        abi: erc20Abi,
      },
    ],
  });

  const { data: balanceData, isFetched, status } = useBalance({
    token: tokenAddress,
    address,
  });

  const balanceLoaded = isConnected && isFetched;

  useEffect(()=>{
    if (tokenAddress && balanceData?.decimals) {
      setTokenBalance(formatUnits(balanceData?.value,18).length>0?formatUnits(balanceData.value,18):'0')
    }
  },[balanceData,tokenAddress])

  useEffect(() => {
    switch (formState) {
      case 'initialState':
        reset();
        setTokenDecimals(undefined);
        setTokenName(undefined);
        setTokenAddress(undefined);
        setRequestWasSuccessful(false);
        break;
      case 'showTokenNameState':
        if (getValues('tokenAddress')) {
          setTokenAddress(getValues('tokenAddress') as Address);
        }
        if (isLoadingContacts) {
          setShowLoader(true);
        } else setShowLoader(false);

        if (contractData?.[0].status === 'failure') {
          setFormState('errorState');
        } else if (contractData?.[0].status === 'success') {
          const tokenDecimals = contractData?.[0].result;
          const tokenName = contractData?.[1].result;
          setTokenDecimals(tokenDecimals);
          setValue('tokenDecimals', tokenDecimals as number);
          setTokenName(tokenName);
          setValue('tokenName', tokenName as string);
        }
        if (balanceLoaded && !contractError ) {
          setRequestWasSuccessful(true);
        }
        break;
    }
  }, [
    formState,
    tokenAddress,
    reset,
    setValue,
    getValues,
    contractData,
    isLoadingContacts,
    setTokenBalance,
    tokenName,
    contractError,
    status,
    balanceLoaded,
  ]);

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

  const onSubmit: SubmitHandler<IFormInputs> = () => {
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
    onClosePopup({ tokenAddress, tokenName, tokenDecimals, tokenBalance, requestWasSuccessful });
  };

  return (
    <div className={cn(styles.addToken, { [styles.addTokenYellowScheme]: colorScheme === 'yellow' })}>
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
                        [styles.inputAddressYellowScheme]:colorScheme === 'yellow',
                        [styles.inputAddressError]: errors.tokenAddress,
                        [styles.inputAddressErrorYellowScheme]: errors.tokenAddress && colorScheme === 'yellow',
                      })}
                      defaultValue=""
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
                  tokenAddress={tokenAddress as Address}
                  tokenName={tokenName}
                  tokenBalance={tokenBalance}
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
              {formState === 'initialState' && <FormButton colorScheme={colorScheme} buttonText="Next" type="submit" />}
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
                {tokenName + ' token has been added'}
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
  );
};

export default AddTokenInfo;
