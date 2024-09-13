import style from "./Submit-button.module.css";

interface ISubmitButtonProps {
  isButtonActive?: boolean;
}

const SubmitButton: React.FC<ISubmitButtonProps> = ({
  isButtonActive = true,
}) => {
  return (
    <button
      className={`${style.button} ${
        !isButtonActive ? style.inactiveButton : ""
      }`}
      disabled={!isButtonActive}
    >
      Send
    </button>
  );
};

export default SubmitButton;
