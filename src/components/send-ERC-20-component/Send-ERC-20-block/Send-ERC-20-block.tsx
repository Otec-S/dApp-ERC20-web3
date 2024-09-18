import { FC } from 'react';
import style from './Send-ERC-20-block.module.css'; // Импорт стилей для блока
// import SubmitButton from '../../../UI/submit-button/Submit-button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SendERC20SendForm from '../Send-ERC-20-send-form/Send-ERC-20-send-form';
import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
// import SendERC20ResultForm from '../Send-ERC-20-result-form/Send-ERC-20-result-form';
// import { useSendTransaction } from 'wagmi';
// import { parseEther } from 'viem';

interface ISendERC20BlockProps {
  blockTitleText: string;
  isTxSuccess: boolean;
  setIsTxSuccess: (value: boolean) => void;
  isTxFormSubmitted: boolean;
  setIsTxFormSubmitted: (value: boolean) => void;
}

const SendERC20Block: FC<ISendERC20BlockProps> = ({
  blockTitleText,
  isTxSuccess,
  setIsTxSuccess,
  isTxFormSubmitted,
  setIsTxFormSubmitted,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isButtonActive, setIsButtonActive] = useState(true);

  return (
    <section className={style.block}>
      <div className={style.blockTitle}>{blockTitleText}</div>
      {/* <form className={style.blockForm} onSubmit={handleSubmit}> */}

      {isTxFormSubmitted ? (
        <SendERC20ResultForm isTxSuccess={isTxSuccess} setIsTxFormSubmitted={setIsTxFormSubmitted} />
      ) : (
        <SendERC20SendForm isTxFormSubmitted={isTxFormSubmitted} setIsTxFormSubmitted={setIsTxFormSubmitted} />
      )}

      {/* <SendERC20SendForm isTxFormSubmitted={isTxFormSubmitted} setIsTxFormSubmitted={setIsTxFormSubmitted} /> */}
      {/* <SendERC20ResultForm isSuccess={isSuccess} /> */}
      {/* <SubmitButton buttonText={isSuccess ? 'Great!' : 'Start again'} isButtonActive={isButtonActive} /> */}
      {/* </form> */}
    </section>
  );
};

export default SendERC20Block;
