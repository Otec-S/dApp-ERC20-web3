import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { erc20Abi, formatUnits, maxUint256 } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';

import { tradeContractAbi } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';
import { ArrowRightIcon, WarningIcon } from '@src/assets/icons';

import FormButton from '../form-button/FormButton';
import { StepPagination } from '../StepPagination/StepPagination';
import { StepStatus } from '../StepPagination/StepPagination.interface';
import { IncomingOfferToken } from './IncomingOfferToken/IncomingOfferToken';
import { SuccessDialog } from './SuccessDialog/SuccessDialog';
import styles from './IncomingOfferBlock.module.css';

interface FormData {
  infiniteApprove: boolean;
}

export const IncomingOfferBlock: FC = () => {
  const { address: walletAddress } = useAccount();
  const { watch, register } = useForm<FormData>();
  const { contractAddress, tokens } = useChainDependentValues();

  const { id } = useParams();
  const isInfiniteApprove = watch('infiniteApprove');
  const tradeId = id ? BigInt(id) : undefined;

  const {
    writeContract: approveTrade,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: acceptTrade,
    data: acceptedTradeHash,
    isPending: isAcceptPending,
    error: acceptError,
    isSuccess: isAcceptSuccess,
  } = useWriteContract();

  const {
    data: offerData,
    isPending: isOfferDataPending,
    error: offerDataError,
  } = useReadContract({
    abi: tradeContractAbi,
    address: contractAddress,
    functionName: 'getOfferDetails',
    args: tradeId && [tradeId],
    query: { refetchInterval: 60000 },
  });

  const [tokenFrom, tokenTo, amountFrom, amountTo, , , optionalTaker, , completed] = offerData || [];

  const {
    data: tokensData,
    isPending: isTokenInfoPending,
    error: tokenInfoError,
  } = useReadContracts({
    allowFailure: false,
    contracts: tokenFrom &&
      tokenTo &&
      walletAddress && [
        { abi: erc20Abi, address: tokenFrom, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenFrom, functionName: 'name' },
        { abi: erc20Abi, address: tokenTo, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenTo, functionName: 'name' },
        { abi: erc20Abi, address: tokenTo, functionName: 'allowance', args: [walletAddress, contractAddress] },
      ],
  });

  const [tokenFromDecimals, tokenFromName, tokenToDecimals, tokenToName, allowance] = tokensData || [];

  useEffect(() => {
    const error = offerDataError || approveError || acceptError || tokenInfoError;
    if (error) {
      toast.error(error.name);
    }
  }, [acceptError, approveError, offerDataError, tokenInfoError]);

  if (isOfferDataPending || isApprovePending || isAcceptPending || isTokenInfoPending) return <BarLoader />;

  const amountFromFormatted = Number(amountFrom && tokenFromDecimals && formatUnits(amountFrom, tokenFromDecimals));
  const amountToFormatted = Number(amountTo && tokenToDecimals && formatUnits(amountTo, tokenToDecimals));
  const rate = Number(amountFromFormatted && amountToFormatted && (amountToFormatted / amountFromFormatted).toFixed(2));
  const steps = [
    { value: 1, status: isApproveSuccess ? StepStatus.COMPLETED : StepStatus.CURRENT },
    { value: 2, status: isApproveSuccess ? StepStatus.CURRENT : StepStatus.DISABLED },
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

  const handleAcceptTrade = () => {
    acceptTrade({
      abi: tradeContractAbi,
      address: contractAddress,
      functionName: 'take',
      args: tradeId && [tradeId],
    });
  };

  return (
    <>
      {tokenFromName && tokenToName && (
        <form>
          <div className={styles.container}>
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>
                {completed && isAcceptSuccess ? 'Offer has been successfully accepted!' : `Offer ID ${tradeId}`}
              </h3>
            </div>
            {completed && isAcceptSuccess ? (
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
      <Toaster />
    </>
  );
};
