import { FC } from 'react';
import cn from 'classnames';

import CheckIcon from '@assets/icons/check_icon.svg';

import { Step, StepStatus } from './StepPagination.interface';
import styles from './StepPagination.module.css';

type Props = {
  steps: Step[];
};

export const StepPagination: FC<Props> = ({ steps }) => {
  return (
    <div className={styles.stepRow}>
      {steps.map((step) => (
        <div
          className={cn(styles.step, {
            [styles.stepLight]: step.status == StepStatus.LIGHT,
            [styles.stepDisable]: step.status === StepStatus.DISABLED,
            [styles.stepDark]: step.status === StepStatus.DARK || step.status === StepStatus.COMPLETED,
          })}
          key={step.value}
        >
          {step.status === StepStatus.COMPLETED ? <CheckIcon /> : <span className={styles.stepText}>{step.value}</span>}
        </div>
      ))}
    </div>
  );
};
