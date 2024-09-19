import { FC } from 'react';

import WarningIcon from '@assets/images/warning_icon.svg';

import styles from './Warning.module.css';

export interface WarningType {
  warningMessage: string;
}

export const Warning: FC<WarningType> = ({ warningMessage }) => {
  return (
    <div className={styles.warning}>
      <WarningIcon />
      {warningMessage}
    </div>
  );
};

export default Warning;
