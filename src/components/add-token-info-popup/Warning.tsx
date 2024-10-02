import { FC } from 'react';
import cn from 'classnames';

import { WarningIcon } from '@assets/icons';

import styles from './Warning.module.css';

interface Props {
  warningMessage: string;
  colorScheme?: 'default' | 'yellow';
}

export const Warning: FC<Props> = ({ warningMessage, colorScheme = 'default' }) => {
  return (
    <div className={cn(styles.warning, { [styles.warningYellowScheme]: colorScheme === 'yellow' })}>
      <WarningIcon />
      {warningMessage}
    </div>
  );
};

export default Warning;
