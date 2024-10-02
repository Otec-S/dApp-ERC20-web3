import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { erc20Abi, maxUint256 } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import { ArrowRightIcon, WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';
import { StepPagination } from '@components/StepPagination/StepPagination';
import { StepStatus } from '@components/StepPagination/StepPagination.interface';
import { tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import { IncomingOfferToken } from '../IncomingOfferToken/IncomingOfferToken';
import styles from './IncomingOfferForm.module.css';

interface FormData {
  infiniteApprove: boolean;
}

interface Props {
  amountFromFormatted: number;
  amountToFormatted: number;
  tokenFromName: string;
  tokenToName: string;
  rate: number;
  allowance?: bigint;
  onAcceptTrade: () => void;
}

export const IncomingOfferForm: FC<Props> = ({
  amountFromFormatted,
  amountToFormatted,
  tokenFromName,
  tokenToName,
  rate,
  allowance,
  onAcceptTrade,
}) => {
  const [searchParams] = useSearchParams();
  const { watch, register } = useForm<FormData>();
  const { contractAddress, tokens } = useChainDependentValues();

  const isInfiniteApprove = watch('infiniteApprove');
  const tradeId = searchParams.get('tradeId') as unknown as bigint;

  const {
    writeContract: approveTrade,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useWriteContract();

  const { data: offerData } = useReadContract({
    abi: tradeContractAbi,
    address: contractAddress,
    functionName: 'getOfferDetails',
    args: [tradeId],
  });

  const [tokenFrom, tokenTo, , amountTo, , , optionalTaker, ,] = offerData || [];

  useEffect(() => {
    const error = approveError;
    if (error) {
      toast.error(error.name);
    }
  }, [approveError]);

  if (isApprovePending) return <BarLoader />;

  const steps = [
    { value: 1, status: isApproveSuccess ? StepStatus.COMPLETED : StepStatus.DARK },
    { value: 2, status: isApproveSuccess ? StepStatus.LIGHT : StepStatus.DISABLED },
  ];
  const isApproved = (allowance && amountTo && allowance >= amountTo) || isApproveSuccess;
  const hasWarning = tokens.every((item) => item.address !== tokenFrom);

  const handleApproveTrade = () => {
    const amount = isInfiniteApprove ? maxUint256 : amountTo;
    if (amount && tokenTo) {
      approveTrade({
        abi: erc20Abi,
        address: tokenTo,
        functionName: 'approve',
        args: [contractAddress, amount],
      });
    }
  };

  return (
    <>
      <div className={styles.infoBlock}>
        <div className={styles.tokenRow}>
          <IncomingOfferToken address={tokenTo} amount={amountToFormatted} text={'You pay '} symbol={tokenToName} />
          <ArrowRightIcon />
          <IncomingOfferToken
            address={tokenFrom}
            amount={amountFromFormatted}
            text={'You get '}
            symbol={tokenFromName}
          />
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
        {hasWarning && (
          <div className={styles.warningBox}>
            <div className={styles.warningIcon}>
              <WarningIcon />
            </div>
            <div className={styles.warningTextCol}>
              <p className={styles.warningText}>
                The {tokenFromName} token you receive is a custom one. Please check the token’s address and make sure
                it’s correct
              </p>
              <p className={styles.warningAddress}>{tokenFrom}</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.approveBlock}>
        <input type="checkbox" {...register('infiniteApprove')} />
        <label htmlFor="infiniteApprove" className={styles.approveText}>
          Infinite approve
        </label>
      </div>
      <div className={styles.buttonBlock}>
        <p className={styles.description}>You will have to sign 2 transactions: Approval of token & Accept Trade</p>
        {isApproved ? (
          <div className={styles.buttonRow}>
            <FormButton
              type="button"
              colorScheme="yellow"
              buttonText="Accept Trade"
              className={styles.button}
              onClick={onAcceptTrade}
            />
          </div>
        ) : (
          <div className={styles.buttonRow}>
            <FormButton
              type="button"
              colorScheme="yellow"
              buttonText="Approve Token"
              className={styles.button}
              onClick={handleApproveTrade}
            />
            <FormButton type="button" buttonText="Accept Trade" disabled className={styles.button} />
          </div>
        )}
        <div className={styles.paginationRow}>
          <StepPagination steps={steps} />
        </div>
      </div>
    </>
  );
};
