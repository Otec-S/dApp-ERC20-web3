import { CSSProperties, FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getAccount, getBalance } from '@wagmi/core';
import { readContracts } from '@wagmi/core';
import cn from 'classnames';
import { Address, formatUnits, isAddress } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { GetBalanceReturnType } from 'wagmi/actions';

import ClearIcon from '@assets/icons/clear_close_icon.svg';
import SuccessIcon from '@assets/icons/success.svg';

import { config } from '../../../wagmiConfig';
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
  colorScheme?:'default'|'yellow'
}

interface IFormInputs {
  tokenAddress: string;
  tokenName:string;
  tokenDecimals:number;
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
  const [tokenName, setTokenName] = useState<string|undefined>(undefined);
  const [tokenDecimals, setTokenDecimals] = useState<number|undefined>(undefined);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState(false);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  if (!isConnected && openConnectModal) {
    openConnectModal();
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();

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
        setShowLoader(true);
        Promise.all([
          readContracts(config, {
            allowFailure: false,
            contracts: [
              {
                address: tokenAddress as Address,
                abi: erc20Abi,
                functionName: 'decimals',
              },
              {
                address: tokenAddress as Address,
                abi: erc20Abi,
                functionName: 'name',
              },
            ],
          }).then((tokenInfo) => {
            setValue('tokenDecimals',tokenInfo[0]);
            setTokenDecimals(tokenInfo[0]);
            setValue('tokenName',tokenInfo[1]);
            setTokenName(tokenInfo[1]);
          }),
          getBalance(config, {
            address: getAccount(config).address as Address,
            token: tokenAddress,
          }).then((balanceData: GetBalanceReturnType) => {
            const balance = formatUnits(balanceData.value, 18);
            setTokenBalance(balance ?? undefined);
            setRequestWasSuccessful(true);
          }),
        ])
        .catch((error) => {
          console.error('Error: ' + error);
          setFormState('errorState');
        })
        .finally(()=>setShowLoader(false));
        break;
    }
  }, [formState, tokenAddress, reset, setValue]);

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
        reset();
        break;
      case 'showTokenAvatarState':
        setFormState('readyToAddState');
        reset();
        break;
    }
  }

  const onHandleErrorButton = () => {
    setFormState('initialState');
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    switch (formState) {
      case 'initialState':
        setTokenAddress(data.tokenAddress as Address);
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
    <div className={cn(styles.addToken,{[styles.addTokenYellowScheme]:colorScheme==='yellow'})}>
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
        <div className={cn(styles.headerWrapper,{[styles.headerWrapperYellow]:colorScheme==='yellow'})}>
          <h5 className={styles.header}>
            {formState !== 'readyToAddState' ? 'Add a custom token' : 'Successful import'}
          </h5>
          <button className={cn(styles.closeForm,{[styles.closeFormYellowScheme]:colorScheme==='yellow'})} onPointerDown={handleCloseForm}>
            <ClearIcon />
          </button>
        </div>
      )}
      <div className={cn(styles.formWrapper,{[styles.formWrapperYellowScheme]:colorScheme==='yellow'})}>
      {formState !== 'readyToAddState' && formState !== 'errorState' && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Warning colorScheme={colorScheme} warningMessage="Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks" />
          <div>
            {formState !== 'showTokenAvatarState' && (
              <>
                <label className={styles.inputLabel}>
                  Token contract address
                  <input
                    disabled={formState !== 'initialState'}
                    className={cn(styles.inputAddress, {
                      [styles.inputAddressError]: errors.tokenAddress?.type === 'validate' && colorScheme !== 'yellow',
                      [styles.inputAddressErrorYellowScheme]: errors.tokenAddress?.type === 'validate'||errors.tokenAddress?.type ==='required' &&  colorScheme === 'yellow',
                      [styles.inputAddressYellowScheme]: colorScheme === 'yellow' && errors.tokenAddress?.type !== 'validate'
                    })}
                    defaultValue=""
                    {...register('tokenAddress', { required: true, validate: (value) => isAddress(value) })}
                  />
                  {errors.tokenAddress?.type === 'required' && <span className={styles.error}>This field is required</span>}
                  {errors.tokenAddress?.type === 'validate' && (
                    <span className={styles.error}>This input is not token address</span>
                  )}
                </label>
                <label className={styles.inputLabel}>
                  Token contract name
                  <input defaultValue="0x0000000000000000000000000000000000000000"
                    {...register('tokenName')} type="text" className={cn(styles.inputName,{
                    [styles.inputNameYellowScheme]:colorScheme==='yellow'
                  })} readOnly />
                </label>
                <div>
                  <label className={styles.inputLabel}>
                    Token contract decimals
                    <input type="text" {...register('tokenDecimals')} defaultValue={18} className={cn(styles.inputDecimals,{
                      [styles.inputDecimalsYellowScheme]:colorScheme==='yellow'
                    })} readOnly />
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
            {formState !== 'initialState' && 
              <FormButton colorScheme={colorScheme} buttonText='Back' onPointerDown={onHandlePreviosButton}/>
            }
            {
              formState !== 'initialState' && <FormButton onPointerDown={onHandleNextButton}  colorScheme={colorScheme} buttonText='Next' type='button'/>
            }
            {
              formState === 'initialState' && <FormButton colorScheme={colorScheme} buttonText='Next' type='submit'/>
            }
          </div>
        </form>
      )}
      {formState === 'readyToAddState' && (
        <>
          <div className={cn(styles.successLogoWrapper,{[styles.successLogoWrapperYellowScheme]:colorScheme==='yellow'})}>
            <SuccessIcon />
            <span className={cn(styles.successLogoText,{[styles.successLogoTextYellowScheme]:colorScheme==='yellow'})}>{tokenName + ' token has been added'}</span>
          </div>
          <FormButton colorScheme={colorScheme} onPointerDown={handleCloseForm} buttonText='Okay' type='button'/>
        </>
      )}
      {formState === 'errorState' && (
        <>
          <div className={styles.successLogoWrapper}>
            <h5 className={styles.header}>Something went wrong. Pls check network and token address.</h5>
          </div>
          <FormButton colorScheme={colorScheme} onPointerDown={onHandleErrorButton} buttonText='Back'/>
        </>
      )}
    </div>
    </div>
  );
};

export default AddTokenInfo;
