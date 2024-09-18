import style from './Submit-button.module.css';

interface ISubmitButtonProps {
  isButtonActive?: boolean;
  buttonText: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<ISubmitButtonProps> = ({ isButtonActive = true, buttonText, disabled = false }) => {
  return (
    <button
      type="submit"
      className={`${style.button} ${!isButtonActive ? style.inactiveButton : ''}`}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default SubmitButton;
