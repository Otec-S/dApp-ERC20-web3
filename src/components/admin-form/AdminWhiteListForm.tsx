import { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MerkleTree } from 'merkletreejs';
import { isAddress, keccak256 } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';
import { Loader } from '@components/loader/Loader';
import { nftContractAddress, Proofs } from '@shared/constants/nftContract';
import { nftContractAbi } from '@shared/constants/nftContractAbi';
import { useProofUpload } from '@shared/hooks/useProofUpload';

import styles from './AdminWhiteListForm.module.css';

interface FormData {
  airdrop: {
    value?: `0x${string}`;
  }[];
  private: {
    value?: `0x${string}`;
  }[];
}

export const AdminWhiteListForm: FC = () => {
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
  const {
    writeContract: writeUri,
    data: approveUri,
    error: uriWriteError,
    isPending: isUriLoading,
  } = useWriteContract();
  const { isLoading: isUriLoadingTransaction } = useWaitForTransactionReceipt({
    hash: approveUri,
  });

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
      args: [airdropTreeRoot],
    });
    writeRootHash({
      abi: nftContractAbi,
      address: nftContractAddress,
      functionName: 'setMerkleRootWhiteList',
      args: [privatePresaleTreeRoot],
    });
    const proofs: Proofs = {
      airdrop: [],
      private: [],
    };
    data.airdrop.forEach((address) => {
      if (address.value) {
        const proofWithAddress = {
          address: address.value,
          proof: isAddress(address.value) ? airdropMerkleTree.getHexProof(keccak256(address.value)) : [],
        };
        proofs.airdrop.push(proofWithAddress);
      }
    });
    data.private.forEach((address) => {
      if (address.value) {
        const proofWithAddress = {
          address: address.value,
          proof: privatePresaleMerkleTree.getHexProof(keccak256(address.value)),
        };
        proofs.private.push(proofWithAddress);
      }
    });
    setProofs(proofs);
  };

  const { uri, loading: proofsLoading, error: proofsUploadError } = useProofUpload(proofs);

  useEffect(() => {
    if (rootHashWriteError) {
      toast.error(`Error to write tree root hash: ${rootHashWriteError.name}`);
    }
    if (uriWriteError) {
      toast.error(`Error to write uri`);
    }
    if (proofsUploadError) {
      toast.error(`Error to upload proofs`);
    }
  }, [rootHashWriteError, uriWriteError, proofsUploadError]);

  if (uri) {
    writeUri({
      address: nftContractAddress,
      abi: nftContractAbi,
      functionName: 'setMerkleProofs',
      args: [uri],
    });
  }

  const dataIsLoading =
    isRootHashLoading || isTransactionLoading || proofsLoading || isUriLoading || isUriLoadingTransaction;

  return (
    <form className={styles.adminWhiteListForm} onSubmit={handleSubmit(onSubmit)}>
      {dataIsLoading && <Loader/>}
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
