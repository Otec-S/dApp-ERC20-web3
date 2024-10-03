import { FC, useState } from 'react';

import styles from '../ERC20trade.module.css';

export const CreateOffer: FC = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);

  if (isOfferFormOpen) {
    return <div></div>;
  }

  return (
    <div className={styles.content}>
      <button className={styles.button} onClick={() => setIsOfferFormOpen(true)}>
        {'Create offer'}
      </button>
    </div>
  );
};
