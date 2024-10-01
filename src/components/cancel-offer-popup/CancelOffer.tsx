import { CSSProperties, FC, FormEventHandler } from 'react';
import { BeatLoader } from 'react-spinners';
import { useAccount, useReadContract } from 'wagmi';

import ClearIcon from '@assets/icons/clear_close_icon.svg';
import FormButton from '@components/form-button/FormButton';
import { tradeContractAbi, tradeContractAddress } from '@src/shared/constants';

import styles from './CancelOffer.module.css';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

interface Props {
  tradeId: bigint;
}

const CancelOffer: FC<Props> = ({ tradeId }) => {
  const { chain } = useAccount();
  const { data: tradeOfferData, isLoading: isLoadingTradeData } = useReadContract({
    abi: tradeContractAbi,
    address: tradeContractAddress[`${chain?.id}`],
    functionName: 'getOfferDetails',
    args: [tradeId],
  });

  console.log(tradeOfferData);
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('submit');
  };

  return (
    <form className={styles.cancelOffer} onSubmit={handleSubmit}>
      {isLoadingTradeData && (
        <div className={styles.loader}>
          <BeatLoader
            color={'red'}
            loading={true}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>Cancel Offer</h5>
        <div className={styles.closeForm}>
          <ClearIcon />
        </div>
      </div>
      <FormButton buttonText="Cancel offer" colorScheme="yellow" type="submit" />
    </form>
  );
};

export default CancelOffer;
