import { CSSProperties, FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { MerkleTree } from 'merkletreejs';
import { Address, isAddress, keccak256 } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';
import { nftContractAddress, Proofs } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';
import { useProofUpload } from '@shared/hooks/useProofUpload';

import styles from './AdminWhiteListForm.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

interface FormData {
  airdrop: {
    value?: Address;
  }[];
  private: {
    value?: Address;
  }[];
}

export const AdminWhiteListForm: FC = () => {
  const { address: walletAddress } = useAccount();
  const [proofs, setProofs] = useState<Proofs | undefined>(undefined);
  const {
    writeContract: writeRootHash,
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
    formState: { errors },
  } = useForm<FormData>();
  const {
    fields: airdropFields,
    append: appendAirdrop,
    remove: removeAirdrop,
  } = useFieldArray({
    name: 'airdrop',
    control,
  });
  const {
    fields: privatePresaleFields,
    append: appendPrivatePresale,
    remove: removePrivatePresale,
  } = useFieldArray({
    name: 'private',
    control,
  });

  const onSubmit = (data: FormData) => {
    const airdropMerkleTree = new MerkleTree(
      data.airdrop.map((address) => address.value),
      keccak256,
      { hashLeaves: true, sortPairs: true },
    );
    const privatePresaleMerkleTree = new MerkleTree(
      data.private.map((address) => address.value),
      keccak256,
      { hashLeaves: true, sortPairs: true },
    );
    const airdropTreeRoot = airdropMerkleTree.getHexRoot();
    const privatePresaleTreeRoot = privatePresaleMerkleTree.getHexRoot();
    writeRootHash({
      abi: nftContractAbi,
      address: nftContractAddress,
      functionName: 'setMerkleRootAirDrop',
      args: [airdropTreeRoot as `0x${string}`],
    });
    writeRootHash({
      abi: nftContractAbi,
      address: nftContractAddress,
      functionName: 'setMerkleRootWhiteList',
      args: [privatePresaleTreeRoot as `0x${string}`],
    });
    const proofs: Proofs = {
      airdrop: [
        {
          address: walletAddress ?? '',
          proof: data.airdrop?.map((value) => value.value ?? '') ?? [],
        },
      ],
      private: [
        {
          address: walletAddress ?? '',
          proof: data.private.map((value) => value.value ?? '') ?? [],
        },
      ],
    };
    setProofs(proofs);
    console.log(proofs);
  };

  const { uri, loading: proofsLoading, error: proofsUploadError } = useProofUpload(proofs);
  console.log(uri);
  useEffect(() => {
    if (proofsUploadError) {
      toast.error(`Error to upload proofs`);
    }
  }, [proofsUploadError]);

  const dataIsLoading = isRootHashLoading || isTransactionLoading || proofsLoading;
  return (
    <form className={styles.adminWhiteListForm} onSubmit={handleSubmit(onSubmit)}>
      {dataIsLoading && (
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
      <h3 className={styles.subheader}>Add or remove addresses of airdrop white list</h3>
      <ul className={styles.addresses}>
        {airdropFields.map((field, index) => {
          return (
            <li className={styles.addressItem} key={field.id}>
              <div className={styles.inputWrapper}>
                <input
                  {...register(`airdrop.${index}.value` as const, {
                    required: true,
                    validate: (value) => value && isAddress(value),
                  })}
                  className={styles.inputAddress}
                />
                {errors.airdrop?.[index]?.value?.type === 'required' && (
                  <div className={styles.error}>
                    {
                      <div className={styles.warningIcon}>
                        <WarningIcon />
                      </div>
                    }
                    {' Required field'}
                  </div>
                )}
                {errors.airdrop?.[index]?.value?.type === 'validate' && (
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
                  onPointerDown={() => removeAirdrop(index)}
                />
              </div>
            </li>
          );
        })}
        <div className={styles.addButton}>
          <FormButton
            colorScheme="yellow"
            type="button"
            buttonText="+"
            title="Add address"
            onPointerDown={() =>
              appendAirdrop({
                value: undefined,
              })
            }
          />
        </div>
      </ul>
      <h3 className={styles.subheader}>Add or remove addresses of private presale white list</h3>
      <ul className={styles.addresses}>
        {privatePresaleFields.map((field, index) => {
          return (
            <li className={styles.addressItem} key={field.id}>
              <div className={styles.inputWrapper}>
                <input
                  {...register(`private.${index}.value` as const, {
                    required: true,
                    validate: (value) => value && isAddress(value),
                  })}
                  className={styles.inputAddress}
                />
                {errors.private?.[index]?.value?.type === 'required' && (
                  <div className={styles.error}>
                    {
                      <div className={styles.warningIcon}>
                        <WarningIcon />
                      </div>
                    }
                    {' Required field'}
                  </div>
                )}
                {errors.private?.[index]?.value?.type === 'validate' && (
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
                  onPointerDown={() => removePrivatePresale(index)}
                />
              </div>
            </li>
          );
        })}
        <div className={styles.addButton}>
          <FormButton
            colorScheme="yellow"
            type="button"
            buttonText="+"
            title="Add address"
            onPointerDown={() =>
              appendPrivatePresale({
                value: undefined,
              })
            }
          />
        </div>
      </ul>
      <FormButton
        title="Submit form"
        disabled={false}
        type="submit"
        buttonText="Set white lists"
        colorScheme="yellow"
      />
    </form>
  );
};
