import { FC } from 'react';
import cn from 'classnames';

import WarningIcon from '@assets/icons/warning_icon.svg';

import styles from './Warning.module.css';

interface WarningTypeProps {
  warningMessage: string;
  colorScheme?:'default'|'yellow';
}

export const Warning: FC<WarningTypeProps> = ({ warningMessage, colorScheme = 'default' }) => {
  return (
    <div className={cn(styles.warning,{[styles.warningYellowScheme]:colorScheme==='yellow'})}>
      <WarningIcon />
      {warningMessage}
    </div>
  );
};

export default Warning;
