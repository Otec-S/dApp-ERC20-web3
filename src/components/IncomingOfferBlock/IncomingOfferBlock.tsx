import { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';

import { ArrowRightIcon, NewWindowIcon, NotFoundIcon, SuccessIcon } from '@src/assets/icons';
import { tradeContractAbi } from '@src/shared/constants';
import { useChainDependentValues } from '@src/shared/hooks';

import FormButton from '../form-button/FormButton';
import { StepPagination } from '../StepPagination/StepPagination';
import { StepStatus } from '../StepPagination/StepPagination.interface';
import styles from './IncomingOfferBlock.module.css';

// const link = 'http://localhost:5173/offer?tradeId=4';

export const IncomingOfferBlock: FC = () => {
  const [searchParams] = useSearchParams();
  const { address: walletAddress } = useAccount();
  const { handleSubmit } = useForm();
  const { contractAddress, tokens, website } = useChainDependentValues();

  const tradeId = searchParams.get('tradeId');

  const [isErrorShown, setIsErrorShown] = useState(false);

  const {
    writeContract: approveTrade,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
  } = useWriteContract();

  const {
    writeContract: acceptTrade,
    data: acceptedTradeHash,
    isPending: isAcceptPending,
    isError: isAcceptError,
  } = useWriteContract();

  const {
    data: offerData,
    isPending: isOfferDataPending,
    isError: isOfferDataError,
  } = useReadContract({
    abi: tradeContractAbi,
    address: contractAddress,
    functionName: 'getOfferDetails',
    args: [tradeId],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenFrom, tokenTo, amountFrom, amountTo, creator, fee, optionalTaker, active, completed] = offerData || [];

  const { data: tokenFromData } = useReadContracts({
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

  const [tokenFromDecimals, tokenFromName, tokenToDecimals, tokenToName, allowance] = tokenFromData || [];
  const isApproved = allowance || isApproveSuccess;

  useEffect(() => {
    setIsErrorShown(isOfferDataError || isApproveError || isAcceptError);
  }, [isAcceptError, isApproveError, isOfferDataError]);

  if (isOfferDataPending || isAcceptPending || isApprovePending) return <BarLoader />;

  const amountFromFormatted = Number(amountFrom && tokenFromDecimals && formatUnits(amountFrom, tokenFromDecimals));
  const amountToFormatted = Number(amountTo && tokenToDecimals && formatUnits(amountTo, tokenToDecimals));
  const rate = amountFromFormatted && amountToFormatted && (amountToFormatted / amountFromFormatted).toFixed(2);
  const steps = [
    { value: 1, status: isApproveSuccess ? StepStatus.COMPLETED : StepStatus.DARK },
    { value: 2, status: isApproveSuccess ? StepStatus.LIGHT : StepStatus.DISABLED },
  ];

  const handleApproveTrade = () => {
    if (amountTo && tokenTo) {
      approveTrade({
        abi: erc20Abi,
        address: tokenTo,
        functionName: 'approve',
        args: [contractAddress, amountTo],
      });
    }
  };

  console.log(contractAddress, tradeId);

  const handleAcceptTrade = () => {
    acceptTrade({
      abi: tradeContractAbi,
      address: contractAddress,
      functionName: 'take',
      args: [tradeId],
    });
  };

  const handleViewTransaction = () => {
    window.open(`https://${website}/tx/${acceptedTradeHash}`, '_blank');
  };

  const renderToken = ({
    address,
    amount,
    text,
    symbol,
  }: {
    address?: Address;
    amount?: number;
    text: string;
    symbol?: string;
  }) => {
    const icon = tokens?.find((item) => item.address === address)?.icon ?? <NotFoundIcon />;

    return (
      <div className={styles.infoBox}>
        <div className={styles.tokenBoxIcon}>{icon}</div>
        <div className={styles.infoCol}>
          <p className={styles.infoText}>{amount}</p>
          <p className={styles.infoDescription}>
            {text} {symbol}
          </p>
        </div>
      </div>
    );
  };

  const renderSuccessDialog = () => {
    if (amountFromFormatted && amountToFormatted && rate) {
      return (
        <div className={styles.successContainer}>
          <SuccessIcon />
          <div className={styles.successInfoRow}>
            <p className={styles.infoText}>{amountFromFormatted}</p>
            <p className={styles.infoText}>{tokenFromName}</p>
            <div className={styles.arrowBox}>
              <ArrowRightIcon />
            </div>
            <p className={styles.infoText}>{amountToFormatted}</p>
            <p className={styles.infoText}>{tokenToName}</p>
            <p className={styles.infoText}>Rate</p>
            <p className={styles.infoText}>{rate}</p>
          </div>
          {acceptedTradeHash && (
            <button type="button" className={styles.newWindowButton} onClick={handleViewTransaction}>
              View transaction <NewWindowIcon />
            </button>
          )}
          <FormButton colorScheme="yellow" type="button" buttonText="Great!" className={styles.greatButton} />
        </div>
      );
    }
    return null;
  };

  const renderForm = () => {
    return (
      <>
        <div className={styles.infoBlock}>
          <div className={styles.tokenRow}>
            {renderToken({
              address: tokenTo,
              amount: amountToFormatted,
              text: 'You pay ',
              symbol: tokenToName,
            })}
            <ArrowRightIcon />
            {renderToken({
              address: tokenFrom,
              amount: amountFromFormatted,
              text: 'You get ',
              symbol: tokenFromName,
            })}
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
          {isApproved ? (
            <div className={styles.buttonRow}>
              <FormButton
                colorScheme="yellow"
                buttonText="Accept Trade"
                className={styles.button}
                onClick={handleAcceptTrade}
              />
            </div>
          ) : (
            <div className={styles.buttonRow}>
              <FormButton
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

  return (
    <form onSubmit={handleSubmit(handleAcceptTrade)}>
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>
            {completed ? 'Offer has been successfully accepted!' : `Offer ID ${tradeId}`}
          </h3>
        </div>
        {completed ? renderSuccessDialog() : renderForm()}
        {isErrorShown &&
          ReactDOM.createPortal(
            <div className={styles.errorWrap}>
              <div className={styles.errorContainer}>
                <div className={styles.successLogoWrapper}>
                  <h5 className={styles.header}>{'Something went wrong'}</h5>
                </div>
                <FormButton colorScheme={'yellow'} onPointerDown={() => setIsErrorShown(false)} buttonText="Back" />
              </div>
            </div>,
            document.getElementsByClassName('app')[0],
          )}
      </div>
    </form>
  );
};
