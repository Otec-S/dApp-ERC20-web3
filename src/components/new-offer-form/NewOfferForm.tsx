import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { Address } from 'viem';

import styles from './AddTokenInfo.module.css';

interface FormData {
  tokenAddress: Address;
  tokenName: string;
  tokenDecimals: number;
}

const NewOfferForm: FC = () => {
  const [formState, setFormState] = useState<
    'initialState' | 'showTokenNameState' | 'showTokenAvatarState' | 'readyToAddState' | 'errorState'
  >('initialState');


  const {
    handleSubmit,
  } = useForm<FormData>();


  const onSubmit: SubmitHandler<FormData> = () => {
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


  return (
    <div className={cn(styles.addToken)}>
      <div className={cn(styles.formWrapper)}>
        {formState !== 'readyToAddState' && formState !== 'errorState' && (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

          </form>
        )}

      </div>
    </div>
  );
};

export default NewOfferForm;
