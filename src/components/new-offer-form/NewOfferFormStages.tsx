import { FC } from 'react';
import cn from 'classnames';

import styles from './NewOfferFormStages.module.css';

interface Props {
  activeStage: 1 | 2 | 3;
  description: string;
  onSelect?: (select: number) => void;
}

const stages = [1, 2, 3];

export const NewOfferFormStages: FC<Props> = ({ activeStage, description, onSelect }) => {
  return (
    <div className={styles.stages}>
      <h5 className={styles.header}>{description}</h5>
      <div className={styles.wrapper}>
        {stages.map((stage) => {
          return (
            <div
              onPointerDown={onSelect && (() => onSelect(stage))}
              key={stage}
              className={cn(styles.stage, { [styles.activeStage]: stage <= activeStage })}
            >
              {stage}
            </div>
          );
        })}
      </div>
    </div>
  );
};
