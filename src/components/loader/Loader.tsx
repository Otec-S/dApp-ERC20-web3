import { CSSProperties, FC } from 'react';
import { BeatLoader } from 'react-spinners';

import styles from './Loader.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '100px auto',
};

export const Loader: FC = () => {
  return (
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
  );
};
