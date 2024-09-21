import { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';

import styles from './FormButton.module.css';

interface IFormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonActive?: boolean;
  buttonText: string;
  colorScheme?: 'default' | 'yellow';
}

const SubmitButton: FC<IFormButtonProps> = ({
  isButtonActive = true,
  buttonText,
  colorScheme = 'default',
  ...rest
}) => {
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

export default SubmitButton;
