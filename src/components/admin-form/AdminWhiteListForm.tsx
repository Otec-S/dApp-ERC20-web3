import { CSSProperties, FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { Address, getAddress, isAddress } from 'viem';

import { WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';

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
    setAddresses(data.addresses);
  };

  const dataIsLoading = false;
  return (
    <form className={styles.adminWhiteListForm} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={styles.subheader}>Add or remove addresses from white list</h3>
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
          onPointerDown={() =>
            append({
              address: undefined,
            })
          }
        />
      </div>
      <FormButton disabled={dataIsLoading} type="submit" buttonText="Set white list" colorScheme="yellow" />
    </form>
  );
};
