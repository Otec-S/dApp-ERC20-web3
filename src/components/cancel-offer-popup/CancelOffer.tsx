import { FC, FormEventHandler } from 'react';

import ClearIcon from '@assets/icons/clear_close_icon.svg';
import FormButton from '@components/form-button/FormButton';

import styles from './CancelOffer.module.css';

const CancelOffer: FC = () => {
  const handleSubmit:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('submit');
  }

  return (
    <form className={styles.cancelOffer} onSubmit={handleSubmit}>
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>Cancel Offer</h5>
        <div className={styles.closeForm}><ClearIcon /></div>
      </div>
      <FormButton buttonText="Cancel offer" colorScheme="yellow" type="submit" />
    </form>
  );
};

export default CancelOffer;
