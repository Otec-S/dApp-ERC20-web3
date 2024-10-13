import { CSSProperties, FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { useReadContracts } from 'wagmi';

import FormButton from '@components/form-button/FormButton';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './AdminSaleForm.module.css';

enum SaleStatus {
  SOON = '0',
  AVAILABLE = '1',
  FINISHED = '2',
}

interface FormData {
  airdrope: string;
  publicSale: string;
  whiteListSale: string;
}

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

export const AdminSaleForm: FC = () => {
  const { data: saleState, isLoading: isSaleLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'airDrop',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'whiteListSale',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'publicSale',
        abi: nftContractAbi,
      },
    ],
  });

  const { register, handleSubmit, setValue } = useForm<FormData>();
  const onSubmit = (data: FormData) => console.log(data);

  useEffect(() => {
    if (saleState) {
      setValue('airdrope', `${saleState[0]}`);
      setValue('whiteListSale', `${saleState[1]}`);
      setValue('publicSale', `${saleState[2]}`);
    }
  }, [saleState, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isSaleLoading && (
        <div className={styles.loader}>
          <BeatLoader
            color={'red'}
            loading={true}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select airdrop state:</legend>
        <label className={styles.label}>
          <input type="radio" value={SaleStatus.SOON} {...register('airdrope')} />
          <span>Soon</span>
        </label>
        <label className={styles.label}>
          <input type="radio" value={SaleStatus.AVAILABLE} {...register('airdrope')} />
          <span>Available</span>
        </label>
        <label className={styles.label}>
          <input type="radio" {...register('airdrope')} value={SaleStatus.FINISHED} />
          <span>Finished</span>
        </label>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select white list state:</legend>
        <label className={styles.label}>
          <input type="radio" {...register('whiteListSale')} value={SaleStatus.SOON} />
          <span>Soon</span>
        </label>
        <div>
          <label className={styles.label}>
            <input type="radio" {...register('whiteListSale')} value={SaleStatus.AVAILABLE} />
            <span>Available</span>
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <input type="radio" {...register('whiteListSale')} value={SaleStatus.FINISHED} />
            <span>Finished</span>
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select public sale state:</legend>
        <div>
          <label className={styles.label}>
            <input type="radio" {...register('publicSale')} value={SaleStatus.SOON} />
            <span>Soon</span>
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <input type="radio" {...register('publicSale')} value={SaleStatus.AVAILABLE} />
            <span>Available</span>
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <input type="radio" {...register('publicSale')} value={SaleStatus.FINISHED} />
            <span>Finished</span>
          </label>
        </div>
      </fieldset>
      <FormButton type="submit" buttonText="Set sell stage" colorScheme="yellow" />
    </form>
  );
};
