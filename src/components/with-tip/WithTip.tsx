import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './WithTip.module.css';

interface Props {
  children: ReactNode;
  text?: string;
  isDisabled?: boolean;
}

export const WithTip: FC<Props> = ({ text = '', isDisabled = false, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [right, setRight] = useState(80);
  const [top, setTop] = useState(24);

  const dimensions = ref.current?.getBoundingClientRect();

  useLayoutEffect(() => {
    if (dimensions) {
      const { height, width } = dimensions;
      setRight(width);
      setTop(height - 8);
    }
  }, [dimensions]);

  return (
    <div className={styles.wrap}>
      {children}
      {Boolean(text) && (
        <div
          className={cn(styles.box, { [styles.disabled]: isDisabled })}
          ref={ref}
          style={{ right: `-${right}px`, top: `-${top}px` }}
        >
          <p className={styles.text}>{text}</p>
        </div>
      )}
    </div>
  );
};
