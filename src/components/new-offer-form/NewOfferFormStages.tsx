import { FC } from 'react';
import cn from 'classnames';

import styles from './NewOfferFormStages.module.css';

interface Props {
  activeStage: 1 | 2 | 3;
  description: string;
}

const stages = [1, 2, 3];

export const NewOfferFormStages: FC<Props> = ({ activeStage, description }) => {
  return (
    <div className={styles.stages}>
      <h5 className={styles.header}>{description}</h5>
      <div className={styles.wrapper}>
        {stages.map((stage) => {
          return (
            <div key={stage} className={cn(styles.stage, { [styles.activeStage]: stage <= activeStage })}>
              {stage}
            </div>
          );
        })}
      </div>
    </div>
  );
};
