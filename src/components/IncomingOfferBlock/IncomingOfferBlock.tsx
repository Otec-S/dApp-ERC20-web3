import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Address, erc20Abi, formatUnits } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';
import { useChainId, useReadContract, useReadContracts, useWriteContract } from 'wagmi';

import { ArrowRightIcon, NewWindowIcon, NotFoundIcon, SuccessIcon } from '@src/assets/icons';
import { tradeContractAbi } from '@src/shared/constants';

import FormButton from '../form-button/FormButton';
import { StepPagination } from '../StepPagination/StepPagination';
import { StepStatus } from '../StepPagination/StepPagination.interface';
import { getTokens } from '../TokensBlock/TokensBlock.utils';
import styles from './IncomingOfferBlock.module.css';

// const link = 'http://localhost:5173/offer?tokenFrom=0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1&tokenTo=0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2&amountFrom=1&amountTo=3.5&tradeId=1&optionalTaker=0x0000000000000000000000000000000000000000';
// const link = 'http://localhost:5173/offer?tradeId=1';

const polygonAddress = '0x30bbAA44F7A80AfC9a5CB1aEEb8247B8E2aDE392';

export const IncomingOfferBlock: FC = () => {
  const [searchParams] = useSearchParams();
  const chainId = useChainId();
  const { handleSubmit } = useForm();

  const isExistChain = chainId === sepolia.id || chainId === polygonAmoy.id;
  const contractAddress: Address = polygonAddress;
  const tokens = isExistChain ? getTokens(chainId) : null;
  const tradeId = searchParams.get('tradeId');

  const {
    writeContract: approveTrade,
    isPending: isApprovePending,
    isError: isApproveError,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  const {
    writeContract: acceptTrade,
    data: acceptedTradeHash,
    isPending: isAcceptPending,
    isError: isAcceptError,
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
    args: [tradeId],
  });

  const [tokenFrom, tokenTo, amountFrom, amountTo, creator, fee, optionalTaker] = offerData || [];

  const { data: tokenFromData } = useReadContracts({
    allowFailure: false,
    contracts: tokenFrom &&
      tokenTo && [
        { abi: erc20Abi, address: tokenFrom, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenFrom, functionName: 'name' },
        { abi: erc20Abi, address: tokenTo, functionName: 'decimals' },
        { abi: erc20Abi, address: tokenTo, functionName: 'name' },
      ],
  });

  if (isOfferDataPending || isAcceptPending || isApprovePending) return <BarLoader />;

  if (offerDataError || isApproveError || isAcceptError) return <div>Error</div>;

  const [tokenFromDecimals, tokenFromName, tokenToDecimals, tokenToName] = tokenFromData || [];
  const amountFromFormatted = amountFrom && tokenFromDecimals && Number(formatUnits(amountFrom, tokenFromDecimals));
  const amountToFormatted = amountTo && tokenToDecimals && Number(formatUnits(amountTo, tokenToDecimals));
  const rate = amountFromFormatted && amountToFormatted && (amountToFormatted / amountFromFormatted).toFixed(2);
  const steps = [
    { value: 1, status: isApproveSuccess ? StepStatus.COMPLETED : StepStatus.DARK },
    { value: 2, status: isApproveSuccess ? StepStatus.LIGHT : StepStatus.DISABLED },
  ];

  const handleApproveTrade = () => {
    if (amountFrom && tokenFrom) {
      approveTrade({
        abi: erc20Abi,
        address: tokenFrom,
        functionName: 'approve',
        args: [contractAddress, amountFrom],
      });
    }
  };

  const handleAcceptTrade = () => {
    acceptTrade({
      abi: tradeContractAbi,
      address: contractAddress,
      functionName: 'take',
      args: [0, tradeId],
    });
  };

  const handleViewTransaction = () => {};

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
    if (amountFromFormatted && amountToFormatted && rate)
      return (
        <div className={styles.container}>
          <div className={styles.titleBlock}>
            <h3 className={styles.title}>Offer has been successfully accepted!</h3>
          </div>
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
            <button type="button" className={styles.newWindowButton} onClick={handleViewTransaction}>
              View transaction <NewWindowIcon />
            </button>
            <FormButton colorScheme="yellow" type="button" buttonText="Great!" className={styles.greatButton} />
          </div>
        </div>
      );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(handleAcceptTrade)}>
        <div className={styles.container}>
          <div className={styles.titleBlock}>
            <h3 className={styles.title}>Offer ID {tradeId}</h3>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.tokenRow}>
              {renderToken({
                address: tokenFrom,
                amount: amountFromFormatted,
                text: 'You pay ',
                symbol: tokenFromName,
              })}
              <ArrowRightIcon />
              {renderToken({ address: tokenTo, amount: amountToFormatted, text: 'You get ', symbol: tokenToName })}
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
            {isApproveSuccess ? (
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
        </div>
      </form>
    );
  };
  //   return renderSuccessDialog();
  return isAcceptSuccess ? renderSuccessDialog() : renderForm();
};
