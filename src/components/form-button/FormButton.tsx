import { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';

import styles from './FormButton.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
  isButtonActive?: boolean;
  colorScheme?: 'default' | 'yellow';
}

const FormButton: FC<Props> = ({ buttonText, isButtonActive = true, colorScheme = 'default', ...rest }) => {
  return (
    <button
      className={cn(styles.formButton, {
        [styles.inactiveButton]: !isButtonActive,
        [styles.buttonYellow]: colorScheme === 'yellow',
      })}
      disabled={!isButtonActive}
      {...rest}
    >
      {buttonText}
    </button>
  );
};

export default FormButton;
