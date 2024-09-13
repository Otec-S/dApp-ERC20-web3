import { FC } from "react";
import SubmitButton from "../../../UI/submit-button/Submit-button";
import SendERC20Block from "../Send-ERC-20-block/Send-ERC-20-block";

interface ISendERC20ResultProps {
  blockTitleText: string;
  buttonText: string;
}

const SendERC20Result: FC<ISendERC20ResultProps> = ({
  blockTitleText,
  buttonText,
}) => {
  return (
    <SendERC20Block blockTitleText={blockTitleText}>
      <SubmitButton buttonText={buttonText} />
    </SendERC20Block>
  );
};

export default SendERC20Result;
