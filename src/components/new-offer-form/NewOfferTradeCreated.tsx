import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import Snackbar from '../snackbar/Snackbar';
import styles from './NewOfferForm.module.css';

interface Props {
  transactionHash?: Address;
}

const NewOfferTradeCreated: FC<Props> = ({ transactionHash }) => {
  const [showCopyOfClipboard, setShowCopyOfClipboard] = useState(false);
  const { chain } = useAccount();
  const handleSnackbarClose = () => {
    setShowCopyOfClipboard(false);
  };
  return (
    <div className={styles.clipboard}>
      <h5 className={styles.clipboardHeader}>Share link</h5>
      <CopyToClipboard
        onCopy={() => setShowCopyOfClipboard(true)}
        text={`${chain?.blockExplorers?.default.url}/tx/${transactionHash}`}
      >
        <div className={styles.clipboardLink}>Copy link</div>
      </CopyToClipboard>
      {showCopyOfClipboard && (
        <Snackbar type="success" onClose={handleSnackbarClose} description="Link copied successfully" />
      )}
    </div>
  );
};

export default NewOfferTradeCreated;
