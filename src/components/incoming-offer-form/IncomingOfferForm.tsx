import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { erc20Abi, formatUnits, maxUint256 } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { ArrowRightIcon, WarningIcon } from '@assets/icons';
import FormButton from '@components/form-button/FormButton';
import { Loader } from '@components/loader/Loader';
import { StepPagination } from '@components/step-pagination/StepPagination';
import { StepStatus } from '@components/step-pagination/StepPagination.interface';
import { erc20abiExtended, tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import { IncomingOfferToken } from './incoming-offer-token/IncomingOfferToken';
import { SuccessDialog } from './success-dialog/SuccessDialog';
import styles from './IncomingOfferForm.module.css';

interface FormData {
  infiniteApprove: boolean;
}

export const IncomingOfferForm: FC = () => {
  const { address: walletAddress } = useAccount();
  const { watch, register } = useForm<FormData>();
  const { contractAddress, tokens } = useChainDependentValues();

  const { id } = useParams();
  const isInfiniteApprove = watch('infiniteApprove');
  const tradeId = id ? BigInt(id) : undefined;

  const { writeContract: approveTrade, data: approveHash, error: approveError } = useWriteContract();
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { writeContract: acceptTrade, data: acceptedTradeHash, error: acceptError } = useWriteContract();
  const { isLoading: isAcceptLoading, isSuccess: isAcceptSuccess } = useWaitForTransactionReceipt({
    hash: acceptedTradeHash,
  });

  const {
    data: offerData,
    isPending: isOfferDataPending,
    error: offerDataError,
    refetch: refetchOfferData,
  } = useReadContract(
    tradeId
      ? {
          abi: tradeContractAbi,
          address: contractAddress,
          functionName: 'getOfferDetails',
          args: [tradeId],
          query: { refetchInterval: 60000 },
        }
      : undefined,
  );

  const [tokenFrom, tokenTo, amountFrom, amountTo, , , optionalTaker, , completed] = offerData || [];

  const {
    data: tokensData,
    isPending: isTokenInfoPending,
    error: tokenInfoError,
    refetch: refetchTokenData,
  } = useReadContracts({
    allowFailure: false,
    contracts: tokenFrom &&
      tokenTo &&
      walletAddress && [
        { abi: erc20abiExtended, address: tokenFrom, functionName: 'decimals' },
        { abi: erc20abiExtended, address: tokenFrom, functionName: 'name' },
        { abi: erc20abiExtended, address: tokenTo, functionName: 'decimals' },
        { abi: erc20abiExtended, address: tokenTo, functionName: 'name' },
        { abi: erc20abiExtended, address: tokenTo, functionName: 'allowance', args: [walletAddress, contractAddress] },
      ],
  });

  const [tokenFromDecimals, tokenFromName, tokenToDecimals, tokenToName, allowance] = tokensData || [];

  useEffect(() => {
    const error = offerDataError || approveError || acceptError || tokenInfoError;
    if (error) {
      toast.error(error.name);
    }
  }, [acceptError, approveError, offerDataError, tokenInfoError]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchTokenData();
    }
  }, [isApproveSuccess, refetchTokenData]);

  useEffect(() => {
    if (isAcceptSuccess) {
      refetchOfferData();
    }
  }, [isAcceptSuccess, refetchOfferData]);

  if (isOfferDataPending || isApproveLoading || isAcceptLoading || isTokenInfoPending) return <Loader />;

  const amountFromFormatted = Number(amountFrom && tokenFromDecimals && formatUnits(amountFrom, tokenFromDecimals));
  const amountToFormatted = Number(amountTo && tokenToDecimals && formatUnits(amountTo, tokenToDecimals));
  const rate = Number(amountFromFormatted && amountToFormatted && (amountToFormatted / amountFromFormatted).toFixed(2));

  const isApproved = allowance && amountTo && allowance >= amountTo;
  const steps = [
    { value: 1, status: isApproved ? StepStatus.COMPLETED : StepStatus.CURRENT },
    { value: 2, status: isApproved ? StepStatus.CURRENT : StepStatus.DISABLED },
  ];

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

  const handleAcceptTrade = () => {
    if (tradeId) {
      acceptTrade({
        abi: tradeContractAbi,
        address: contractAddress,
        functionName: 'take',
        args: [tradeId],
      });
    }
  };

  return (
    <>
      {tokenFromName && tokenToName && (
        <form>
          <div className={styles.container}>
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>
                {completed ? 'Offer has been successfully accepted!' : `Offer ID ${tradeId}`}
              </h3>
            </div>
            {completed ? (
              <SuccessDialog
                acceptedTradeHash={acceptedTradeHash}
                amountFromFormatted={amountFromFormatted}
                amountToFormatted={amountToFormatted}
                tokenFromName={tokenFromName}
                tokenToName={tokenToName}
                rate={rate}
              />
            ) : (
              <>
                <div className={styles.infoBlock}>
                  <div className={styles.tokenRow}>
                    <IncomingOfferToken
                      address={tokenTo}
                      amount={amountToFormatted}
                      text={'You pay '}
                      symbol={tokenToName}
                    />
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
                          The {tokenFromName} token you receive is a custom one. Please check the token’s address and
                          make sure it’s correct
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
                  <p className={styles.description}>
                    You will have to sign 2 transactions: Approval of token & Accept Trade
                  </p>
                  {isApproved ? (
                    <div className={styles.buttonRow}>
                      <FormButton
                        type="button"
                        colorScheme="yellow"
                        buttonText="Accept Trade"
                        className={styles.button}
                        onClick={handleAcceptTrade}
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
            )}
          </div>
        </form>
      )}
    </>
  );
};
