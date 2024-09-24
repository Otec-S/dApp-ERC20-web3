import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReadContracts } from 'wagmi';

import { contractAbi, tokens } from '@src/assets/constants';

import { StepPagination } from '../StepPagination/StepPagination';
import { IStep, StepStatus } from '../StepPagination/StepPagination.interface';
import styles from './IncomingOfferBlock.module.css';

// const link = 'http://localhost:5173/offer?ex_token=0xf300c9bf1A045844f17B093a6D56BC33685e5D05&in_token=0xA68ecAb53bdcFdC753378a088CfB29d42915617E&ex_token_count=16.54&in_token_count=';

export const IncomingOfferBlock: FC = () => {
  const offerId = '#123456';
  const contractAddress = '0x9CE9DFFA60c558E22178172DDa1774234AECAEBd';

  const [searchParams] = useSearchParams();

  const exToken = tokens.find((item) => item.sepoliaAddress === searchParams.get('ex_token'));
  const inToken = tokens.find((item) => item.sepoliaAddress === searchParams.get('in_token'));
  const { data, error, isError, isPending } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: contractAddress,
        functionName: 'owner',
        abi: contractAbi,
      },
      {
        address: contractAddress,
        functionName: 'feeBasisPoints',
        abi: contractAbi,
      },
    ],
  });

  useEffect(() => {
    console.log(data, isError, isPending, error);
  }, [data, isError, isPending, error]);

  const [steps, setSteps] = useState<IStep[]>([
    { value: 1, status: StepStatus.CURRENT },
    { value: 2, status: StepStatus.INITIAL },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <h3 className={styles.title}>Offer ID {offerId}</h3>
      </div>
      <div className={styles.infoBlock}>
        <div className={styles.tokenRow}>
          <div className={styles.tokenBox}>
            <div className={styles.tokenBoxIcon}>{exToken?.icon}</div>
            <div className={styles.tokenBoxCol}>
              <p className={styles.tokenBoxCount}></p>
            </div>
          </div>
          <div className={styles.tokenBox}>
            <div className={styles.tokenBoxIcon}>{inToken?.icon}</div>
            <div className={styles.tokenBoxCol}>
              <p className={styles.tokenBoxCount}></p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.approveBlock}>
        <h3 className={styles.title}>Offer ID {offerId}</h3>
      </div>
      <div className={styles.buttonBlock}>
        <p className={styles.description}>You will have to sign 2 transactions: Approval of token & Accept Trade</p>
        <div className={styles.buttonRow}></div>
        <div>
          <StepPagination steps={steps} />
        </div>
      </div>
    </div>
  );
};
