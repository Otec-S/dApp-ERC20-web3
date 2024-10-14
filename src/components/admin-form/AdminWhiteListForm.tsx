import { CSSProperties, FC } from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';

import FormButton from '@components/form-button/FormButton';

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

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

export const AdminWhiteListForm: FC = () => {

  const { handleSubmit } = useForm<FormData>();


  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const dataIsLoading = false;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <FormButton disabled={dataIsLoading} type="submit" buttonText="Set white list" colorScheme="yellow" />
    </form>
  );
};
