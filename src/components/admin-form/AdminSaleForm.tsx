import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import FormButton from '@components/form-button/FormButton';
import { Loader } from '@components/loader/Loader';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './AdminSaleForm.module.css';

enum SaleStatus {
  SOON = '0',
  AVAILABLE = '1',
  FINISHED = '2',
}

interface FormData {
  airdrope: SaleStatus;
  publicSale: SaleStatus;
  whiteListSale: SaleStatus;
}

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

  useEffect(() => {
    if (saleState) {
      setValue('airdrope', `${saleState[0]}` as SaleStatus);
      setValue('whiteListSale', `${saleState[1]}` as SaleStatus);
      setValue('publicSale', `${saleState[2]}` as SaleStatus);
    }
  }, [saleState, setValue]);

  const {
    writeContract: approveAirdrop,
    data: approveAirdropHash,
    error: approveAirdropError,
    isPending: isWriteApproveAirdropPending,
  } = useWriteContract();
  const { isLoading: isApproveAirdropLoading } = useWaitForTransactionReceipt({
    hash: approveAirdropHash,
  });
  const {
    writeContract: approveWhiteListSale,
    data: approveWhiteListSaleHash,
    error: approveWhiteListSaleError,
    isPending: isWriteWhiteListPending,
  } = useWriteContract();
  const { isLoading: isApproveWhiteListSaleLoading } = useWaitForTransactionReceipt({
    hash: approveWhiteListSaleHash,
  });
  const {
    writeContract: approvePublicSale,
    data: approvePublicSaleHash,
    error: approvePublicSaleError,
    isPending: isWritePublicSalePending,
  } = useWriteContract();
  const { isLoading: isApprovePublicSaleLoading } = useWaitForTransactionReceipt({
    hash: approvePublicSaleHash,
  });

  useEffect(() => {
    if (approveAirdropError) {
      toast.error(`Error to write airdrop stage: ${approveAirdropError.name}`);
    }
    if (approveWhiteListSaleError) {
      toast.error(`Error to write white list sale stage: ${approveWhiteListSaleError.name}`);
    }
    if (approvePublicSaleError) {
      toast.error(`Error to write public sale stage: ${approvePublicSaleError.name}`);
    }
  }, [approveAirdropError, approveWhiteListSaleError, approvePublicSaleError]);

  const onSubmit = (data: FormData) => {
    if (saleState && data.airdrope !== `${saleState[0]}`) {
      approveAirdrop({
        abi: nftContractAbi,
        address: nftContractAddress,
        functionName: 'toggleAirDrop',
        args: [Number(data.airdrope)],
      });
    }
    if (saleState && data.whiteListSale !== `${saleState[1]}`) {
      approveWhiteListSale({
        abi: nftContractAbi,
        address: nftContractAddress,
        functionName: 'toggleWhiteListSale',
        args: [Number(data.whiteListSale)],
      });
    }
    if (saleState && data.publicSale !== `${saleState[2]}`) {
      approvePublicSale({
        abi: nftContractAbi,
        address: nftContractAddress,
        functionName: 'togglePublicSale',
        args: [Number(data.publicSale)],
      });
    }
  };

  const dataIsLoading =
    isWriteApproveAirdropPending ||
    isWriteWhiteListPending ||
    isWritePublicSalePending ||
    isSaleLoading ||
    isApproveWhiteListSaleLoading ||
    isApproveAirdropLoading ||
    isApprovePublicSaleLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {dataIsLoading && <Loader />}
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select airdrop stage:</legend>
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
        <legend className={styles.label}>Select white list stage:</legend>
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
        <legend className={styles.label}>Select public sale stage:</legend>
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
      <FormButton disabled={dataIsLoading} type="submit" buttonText="Set sell stage" colorScheme="yellow" />
    </form>
  );
};
