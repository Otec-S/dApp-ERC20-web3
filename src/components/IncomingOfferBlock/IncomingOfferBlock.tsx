import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useWriteContract } from 'wagmi';

import ArrowRightIcon from '@assets/icons/arrow-right.svg';
import { tokens } from '@src/shared/constants';

import FormButton from '../form-button/FormButton';
import { StepPagination } from '../StepPagination/StepPagination';
import { StepStatus } from '../StepPagination/StepPagination.interface';
import styles from './IncomingOfferBlock.module.css';

// const link = 'http://localhost:5173/offer?tokenFrom=0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1&tokenTo=0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2&amountFrom=1&amountTo=3.5&tradeId=1&optionalTaker=0x0000000000000000000000000000000000000000';

export const IncomingOfferBlock: FC = () => {
  const [searchParams] = useSearchParams();

  const tokenFrom = tokens.find((item) => item.polygonAddress === searchParams.get('tokenFrom'));
  const tokenTo = tokens.find((item) => item.polygonAddress === searchParams.get('tokenTo'));
  const amountFrom = searchParams.get('amountFrom');
  const amountTo = searchParams.get('amountTo');
  const tradeId = searchParams.get('tradeId');
  const optionalTaker = searchParams.get('optionalTaker');

  const { handleSubmit } = useForm();
  const { writeContract, data, isPending, error } = useWriteContract();

  const rate = (Number(amountTo) / Number(amountFrom)).toFixed(2);

  const handleAcceptTrade = (formValues) => {
    console.log(formValues);
  };

  useEffect(() => {
    console.log(data, isPending, error);
  }, [data, isPending, error]);

  const steps = [
    { value: 1, status: StepStatus.DARK },
    { value: 2, status: StepStatus.DISABLED },
  ];

  return (
    <form onSubmit={handleSubmit(handleAcceptTrade)}>
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>Offer ID {tradeId}</h3>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.tokenRow}>
            <div className={styles.infoBox}>
              <div className={styles.tokenBoxIcon}>{tokenFrom?.icon}</div>
              <div className={styles.infoCol}>
                <p className={styles.infoText}>{amountFrom}</p>
                <p className={styles.infoDescription}>{`You pay ${tokenFrom?.name}`}</p>
              </div>
            </div>
            <ArrowRightIcon />
            <div className={styles.infoBox}>
              <div className={styles.tokenBoxIcon}>{tokenTo?.icon}</div>
              <div className={styles.infoCol}>
                <p className={styles.infoText}>{amountTo}</p>
                <p className={styles.infoDescription}>You get {tokenTo?.name}</p>
              </div>
            </div>
            <div className={styles.rateBox}>
              <div className={styles.infoCol}>
                <p className={styles.infoText}>{rate}</p>
                <p className={styles.infoDescription}>Rate</p>
              </div>
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.arrowBox}>
              <ArrowRightIcon />
            </div>
            <div className={styles.infoCol}>
              <p className={styles.infoText}>{optionalTaker}</p>
              <p className={styles.infoDescription}>Receiver</p>
            </div>
          </div>
        </div>
        <div className={styles.approveBlock}>
          <input type="checkbox" name="infiniteApprove" />
          <label htmlFor="infiniteApprove" className={styles.approveText}>
            Infinite approve
          </label>
        </div>
        <div className={styles.buttonBlock}>
          <p className={styles.description}>You will have to sign 2 transactions: Approval of token & Accept Trade</p>
          <div className={styles.buttonRow}>
            <FormButton colorScheme="yellow" type="submit" buttonText="Approve Token" className={styles.button}>
              Approve Token
            </FormButton>
            <FormButton type="button" buttonText="Accept Trade" disabled className={styles.button} />
          </div>
          <div className={styles.paginationRow}>
            <StepPagination steps={steps} />
          </div>
        </div>
      </div>
    </form>
  );
};
