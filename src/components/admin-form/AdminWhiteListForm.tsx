import { CSSProperties, FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { MerkleTree } from 'merkletreejs';
import { Address, getAddress, isAddress, keccak256 } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';
import { nftContractAddress } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';

import styles from './AdminWhiteListForm.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

const mockAddresses = [
  { address: getAddress('0x58ee5953d47C1dD226CcC18eeBc337Dee91f04dA') },
  { address: getAddress('0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054') },
];

interface FormData {
  addresses: {
    address: Address | undefined;
  }[];
}

export const AdminWhiteListForm: FC = () => {
  const [addresses, setAddresses] = useState<Array<{ address: Address | undefined }>>(mockAddresses);
  const {
    writeContract: writeTreeRootHash,
    data: approveTreeRootHash,
    error: rootHashWriteError,
    isPending: isTransactionLoading,
  } = useWriteContract();
  const { isLoading: isRootHashLoading } = useWaitForTransactionReceipt({
    hash: approveTreeRootHash,
  });

  useEffect(() => {
    if (rootHashWriteError) {
      toast.error(`Error to write tree root hash: ${rootHashWriteError.name}`);
    }
  }, [rootHashWriteError]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { fields, append, remove } = useFieldArray({
    name: 'addresses',
    control,
  });
  useEffect(() => {
    setValue('addresses', addresses);
  }, [addresses, setValue]);

  const onSubmit = (data: FormData) => {
    const merkleTree = new MerkleTree(
      data.addresses.map((address) => address.address),
      keccak256,
      { hashLeaves: true, sortPairs: true },
    );
    const treeRoot = merkleTree.getHexRoot();
    setAddresses(data.addresses);
    writeTreeRootHash({
      abi: nftContractAbi,
      address: nftContractAddress,
      functionName: 'setMerkleRootWhiteList',
      args: [treeRoot as `0x${string}`],
    });
  };

  return (
    <form className={styles.adminWhiteListForm} onSubmit={handleSubmit(onSubmit)}>
      {isRootHashLoading ||
        (isTransactionLoading && (
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
        ))}
      <h3 className={styles.subheader}>Add or remove addresses from white list</h3>
      <ul className={styles.addresses}>
        {fields.map((field, index) => {
          return (
            <li className={styles.addressItem} key={field.id}>
              <div className={styles.inputWrapper}>
                <input
                  {...register(`addresses.${index}.address` as const, {
                    required: true,
                    validate: (value) => value && isAddress(value),
                  })}
                  className={styles.inputAddress}
                />
                {errors.addresses?.[index]?.address?.type === 'required' && (
                  <div className={styles.error}>
                    {
                      <div className={styles.warningIcon}>
                        <WarningIcon />
                      </div>
                    }
                    {' Required field'}
                  </div>
                )}
                {errors.addresses?.[index]?.address?.type === 'validate' && (
                  <div className={styles.error}>
                    {
                      <div className={styles.warningIcon}>
                        <WarningIcon />
                      </div>
                    }
                    {' Input is not address'}
                  </div>
                )}
              </div>
              <div className={styles.deleteButton}>
                <FormButton
                  colorScheme="yellow"
                  type="button"
                  title="Delete address"
                  buttonText="Delete"
                  onPointerDown={() => remove(index)}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.addButton}>
        <FormButton
          colorScheme="yellow"
          type="button"
          buttonText="+"
          title="Add address"
          onPointerDown={() =>
            append({
              address: undefined,
            })
          }
        />
      </div>
      <FormButton
        title="Submit form"
        disabled={isRootHashLoading}
        type="submit"
        buttonText="Set white list"
        colorScheme="yellow"
      />
    </form>
  );
};
