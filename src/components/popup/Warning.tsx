import { FC } from 'react';

import WarningIcon from '@assets/icons/warning_icon.svg';

import styles from './Warning.module.css';

interface WarningTypeProps {
  warningMessage: string;
}

export const Warning: FC<WarningTypeProps> = ({ warningMessage }) => {
  return (
    <div className={styles.warning}>
      <WarningIcon />
      {warningMessage}
    </div>
  );
};

export default Warning;
