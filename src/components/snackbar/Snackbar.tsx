import { FC } from 'react';
import cn from 'classnames';

import Close from '@assets/icons/close.svg';

import styles from './Snackbar.module.css';

interface Props {
  type: 'error' | 'success';
  description: string;
  onClose: () => void;
}

const Snackbar: FC<Props> = ({ type = 'success', description, onClose }) => {
  return (
    <div onPointerDown={onClose} className={cn(styles.snackbar, { [styles.snackbarError]: type === 'error' })}>
      <span>{description}</span>
      <div className={styles.icon} onPointerDown={onClose}>
        <Close />
      </div>
    </div>
  );
};

export default Snackbar;
