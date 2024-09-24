import { FC } from 'react';

import { IStep } from './StepPagination.interface';
import styles from './StepPagination.module.css';

type Props = {
  steps: IStep[];
};

export const StepPagination: FC<Props> = ({ steps }) => {
  return (
    <div className={styles.stepRow}>
      {steps.map((step) => (
        <div className={styles.step} key={step.value}>
          {step.value}
        </div>
      ))}
    </div>
  );
};
