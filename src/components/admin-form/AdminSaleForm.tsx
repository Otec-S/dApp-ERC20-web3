import { CSSProperties, FC } from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { useReadContracts } from 'wagmi';

import FormButton from '@components/form-button/FormButton';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './AdminSaleForm.module.css';

enum SaleStatus {
  SOON = 0,
  AVAILABLE = 1,
  FINISHED = 2,
}

interface FormData {
  airdrope: SaleStatus;
  publicSale: SaleStatus;
  whiteListSale: SaleStatus;
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
  console.log(saleState);
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: FormData) => console.log(data);

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
        <div>
          <input
            type="radio"
            id="airdrope0"
            value={SaleStatus.SOON}
            checked={saleState && saleState[0] === SaleStatus.SOON}
            {...register('airdrope')}
          />
          <label className={styles.label} htmlFor="airdrope0">
            Soon
          </label>
        </div>
        <div>
          <input
            type="radio"
            checked={saleState && saleState[0] === SaleStatus.AVAILABLE}
            id="airdrope1"
            value={SaleStatus.AVAILABLE}
            {...register('airdrope')}
          />
          <label className={styles.label} htmlFor="airdrope1">
            Available
          </label>
        </div>
        <div>
          <input
            checked={saleState && saleState[0] === SaleStatus.FINISHED}
            type="radio"
            id="airdrope2"
            {...register('airdrope')}
            value={SaleStatus.FINISHED}
          />
          <label className={styles.label} htmlFor="airdrope2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select white list state:</legend>
        <div>
          <input
            checked={saleState && saleState[1] === SaleStatus.SOON}
            type="radio"
            id="whitelist0"
            {...register('whiteListSale')}
            value={SaleStatus.SOON}
          />
          <label className={styles.label} htmlFor="whitelist0">
            Soon
          </label>
        </div>
        <div>
          <input
            checked={saleState && saleState[1] === SaleStatus.AVAILABLE}
            type="radio"
            id="whitelist1"
            {...register('whiteListSale')}
            value={SaleStatus.AVAILABLE}
          />
          <label className={styles.label} htmlFor="whitelist1">
            Available
          </label>
        </div>
        <div>
          <input
            checked={saleState && saleState[1] === SaleStatus.FINISHED}
            type="radio"
            id="whitelist2"
            {...register('whiteListSale')}
            value={SaleStatus.FINISHED}
          />
          <label className={styles.label} htmlFor="whitelist2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select public sale state:</legend>
        <div>
          <input
            checked={saleState && saleState[2] === SaleStatus.SOON}
            type="radio"
            id="publicSale0"
            {...register('publicSale')}
            value={SaleStatus.SOON}
          />
          <label className={styles.label} htmlFor="publicSale0">
            Soon
          </label>
        </div>
        <div>
          <input
            checked={saleState && saleState[2] === SaleStatus.AVAILABLE}
            type="radio"
            id="publicSale1"
            {...register('publicSale')}
            value={SaleStatus.AVAILABLE}
          />
          <label className={styles.label} htmlFor="publicSale1">
            Available
          </label>
        </div>
        <div>
          <input
            checked={saleState && saleState[2] === SaleStatus.FINISHED}
            type="radio"
            id="publicSale2"
            {...register('publicSale')}
            value={SaleStatus.FINISHED}
          />
          <label className={styles.label} htmlFor="publicSale2">
            Finished
          </label>
        </div>
      </fieldset>
      <FormButton type="submit" buttonText="Set sell stage" colorScheme="yellow" />
    </form>
  );
};
