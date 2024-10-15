import { FC, useState } from 'react';

import { ArrowDownIcon } from '@assets/icons';
import { NFTFile, useEtherPrice } from '@shared/hooks';
import { getFormattedPrice } from '@shared/utils/getFormattedPrice';

import styles from './MintingForm.module.css';

interface Props {
  title: string;
  description: string;
  balance: number;
  price: number;
  maxAmount: number;
  files: NFTFile[];
  onClick: ({ amount }: { amount: number }) => void;
}

export const MintingForm: FC<Props> = ({ title, description, balance, price, maxAmount, files, onClick }) => {
  const { ethusd } = useEtherPrice();

  const [amount, setAmount] = useState(0);

  const totalCost = Math.round(amount * price * Math.pow(10, 18)) / Math.pow(10, 18);

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.contentRow}>
        <div className={styles.contentBlock}>
          <p className={styles.description}>{description}</p>
          <div className={styles.contentInfo}>
            <div className={styles.contentInfoRow}>
              <p className={styles.contentInfoText}>Your balance</p>
              <div className={styles.contentInfoUnderline}></div>
              <p className={styles.contentInfoData}>{`${balance} ETH (${getFormattedPrice(balance * ethusd)})`}</p>
            </div>
            <div className={styles.contentInfoRow}>
              <p className={styles.contentInfoText}>Presale Price</p>
              <div className={styles.contentInfoUnderline}></div>
              <p className={styles.contentInfoData}>{`${price} ETH (${getFormattedPrice(price * ethusd)})`}</p>
            </div>
            <div className={styles.contentInfoRow}>
              <p className={styles.contentInfoText}>Amount of NFT</p>
              <div className={styles.contentInfoUnderline}></div>
              <div className={styles.counterRow}>
                <button
                  className={styles.counterButton}
                  onClick={() => setAmount((prev) => prev - 1)}
                  disabled={amount === 0}
                >
                  <ArrowDownIcon />
                </button>
                <p className={styles.contentInfoData}>{`${amount}/${maxAmount}`}</p>{' '}
                <button
                  className={styles.counterButton}
                  onClick={() => setAmount((prev) => prev + 1)}
                  disabled={amount === maxAmount || totalCost >= balance}
                >
                  <span className={styles.arrowUpIcon}>
                    <ArrowDownIcon />
                  </span>
                </button>
              </div>
            </div>
            <div className={styles.contentInfoRow}>
              <p className={styles.contentInfoText}>Total Cost</p>
              <div className={styles.contentInfoUnderline}></div>
              <p className={styles.contentInfoData}>{`${totalCost} ETH (${getFormattedPrice(totalCost * ethusd)})`}</p>
            </div>
          </div>
          <button
            className={styles.mintButton}
            disabled={totalCost > balance || amount === 0}
            onClick={() => onClick({ amount })}
          >{`Mint ${amount} nft`}</button>
        </div>
        <div className={styles.imageGroup}>
          <div className={styles.contentImage}>
            <img className={styles.image} src={files?.[0]?.image ?? ''}></img>
          </div>
          <div className={styles.contentImage}>
            <img className={styles.image} src={files?.[1]?.image ?? ''}></img>
          </div>
        </div>
      </div>
    </div>
  );
};
