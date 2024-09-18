import style from './Submit-button.module.css';

interface ISubmitButtonProps {
  isButtonActive?: boolean;
  buttonText: string;
}

const SubmitButton: React.FC<ISubmitButtonProps> = ({ isButtonActive = true, buttonText }) => {
  return (
    <button
      type="submit"
      className={`${style.button} ${!isButtonActive ? style.inactiveButton : ''}`}
      disabled={!isButtonActive}
    >
      {buttonText}
    </button>
  );
};

export default SubmitButton;
