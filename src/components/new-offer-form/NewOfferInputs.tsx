import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import cn from 'classnames';
import { Address, isAddress } from 'viem';

import ArrowDown from '@assets/icons/arrow_down.svg';
import { WarningIcon } from '@src/assets/icons';
import { Token } from '@src/shared/constants';
import getTokenIcon from '@src/utils/getTokenIcon';

import { TokenPopup } from '../TokenPopup/TokenPopup';
import { TokenDataNewOfferForm } from './NewOfferForm';
import styles from './NewOfferForm.module.css';

type FormStages = 'approveToken' | 'createTrade' | 'tradeCreated';
type TokenSelect = 'from' | 'to' | 'customFrom' | 'customTo';

interface FormData {
  from: number;
  to: number;
  infiniteApprove: boolean;
  tokenFrom: Address;
  tokenTo: Address;
  optionalTaker: Address;
}

interface Props {
  formStage: FormStages;
  balanceOfTokenFrom?: number;
  showDefaultTokenPopupTo: boolean;
  rate: number;
  serviceFee: string;
  tokenFrom?: TokenDataNewOfferForm;
  tokenTo?: TokenDataNewOfferForm;
  contractsData?: [bigint, bigint, bigint];
  showDefaultTokenPopupFrom: boolean;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleSetTokenMaxValue: () => void;
  handleDefaultTokenChoice: (data: Token, type: 'from' | 'to') => void;
  handleTokenPopupClose: () => void;
  handleTokenPopupOpen: (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>, data: TokenSelect) => void;
}

export const NewOfferInputs: FC<Props> = ({
  errors,
  formStage,
  balanceOfTokenFrom,
  register,
  showDefaultTokenPopupTo,
  handleSetTokenMaxValue,
  rate,
  serviceFee,
  tokenFrom,
  tokenTo,
  contractsData,
  showDefaultTokenPopupFrom,
  handleDefaultTokenChoice,
  handleTokenPopupClose,
  handleTokenPopupOpen,
}) => (
    <div className={styles.inputs}>
      <div className={styles.inputsWraper}>
        <label className={styles.label}>
          From
          <input
            className={cn(styles.inputQuantity, {
              [styles.inputQuantityError]: errors.from?.type === 'validate',
            })}
            type="number"
            step="0.000000000000000001"
            placeholder="0"
            readOnly={formStage !== 'approveToken'}
            {...register('from', {
              validate: (value) => (balanceOfTokenFrom ? value > 0 && value <= balanceOfTokenFrom : value > 0),
            })}
          />
          {errors.from?.type === 'validate' && (
            <div className={styles.error}>
              {
                <div className={styles.warningIcon}>
                  <WarningIcon />
                </div>
              }
              {' Unsufficient balance'}
            </div>
          )}
          {!errors.from && contractsData && (
            <div className={styles.tokenBalanceWrapper}>
              <span className={styles.tokenBalance}>{`Balance: ${balanceOfTokenFrom}`}</span>
              <button onPointerDown={handleSetTokenMaxValue} className={styles.tokenBalanceButton} type="button">
                Max
              </button>
            </div>
          )}
          {showDefaultTokenPopupFrom && (
            <div className={styles.tokenPopupContainer}>
              <TokenPopup
                onCLose={handleTokenPopupClose}
                onSelect={(data) => handleDefaultTokenChoice(data, 'from')}
                colorScheme="light"
              />
            </div>
          )}
          <div onPointerDown={(e) => handleTokenPopupOpen(e, 'from')} className={styles.tokenPopup}>
            <div className={styles.tokenIcon}>{tokenFrom?.address && getTokenIcon(tokenFrom?.address)}</div>
            <div className={styles.tokenArrow}>
              <ArrowDown />
            </div>
          </div>
          <button
            onPointerDown={(e) => handleTokenPopupOpen(e, 'customFrom')}
            className={styles.buttonAddCustomToken}
            type="button"
          >
            + Add a custom token
          </button>
        </label>
        <label className={styles.label}>
          To
          <input
            className={styles.inputQuantity}
            type="number"
            step="0.000000000000000001"
            placeholder="0"
            {...register('to', { validate: (value) => formStage==='approveToken' ? true : value > 0})}
          />
          {errors.to?.type === 'required' && (
            <div className={styles.error}>
              {
                <div className={styles.warningIcon}>
                  <WarningIcon />
                </div>
              }
              {' Required field'}
            </div>
          )}
          {errors.to?.type === 'validate' && (
            <div className={styles.error}>
              {
                <div className={styles.warningIcon}>
                  <WarningIcon />
                </div>
              }
              {' Unsufficient balance'}
            </div>
          )}
          {showDefaultTokenPopupTo && (
            <div className={styles.tokenPopupContainer}>
              <TokenPopup
                onCLose={handleTokenPopupClose}
                onSelect={(token) => handleDefaultTokenChoice(token, 'to')}
                colorScheme="light"
              />
            </div>
          )}
          <div onPointerDown={(e) => handleTokenPopupOpen(e, 'to')} className={styles.tokenPopup}>
            <div className={styles.tokenIcon}>{tokenTo?.address && getTokenIcon(tokenTo?.address)}</div>
            <div className={styles.tokenArrow}>
              <ArrowDown />
            </div>
          </div>
          <button
            onPointerDown={(e) => handleTokenPopupOpen(e, 'customTo')}
            className={styles.buttonAddCustomToken}
            type="button"
          >
            + Add a custom token
          </button>
        </label>
      </div>
      <div className={styles.additionalInputsWrapper}>
        <div className={styles.labelRate}>
          <span className={styles.inputRate}>{rate}</span>
          <span className={styles.labelText}>Rate</span>
        </div>
        <label className={styles.labelReceiver}>
          <input
            className={styles.inputReceiver}
            type="text"
            defaultValue="0x0000000000000000000000000000000000000000"
            {...register('optionalTaker', { validate: (value) => isAddress(value) })}
          />
          <span className={styles.labelText}>Receiver</span>
          {errors.optionalTaker?.type === 'validate' && (
            <div className={styles.optionalTakerError}>
              {
                <div className={styles.warningIcon}>
                  <WarningIcon />
                </div>
              }
              {' Please input address'}
            </div>
          )}
        </label>
      </div>
      <div className={styles.approveWrraper}>
        <span className={styles.fee}>{serviceFee}</span>
        <div>
          <input type="checkbox" id="infiniteapprove" {...register('infiniteApprove')} />
          <label htmlFor="infiniteapprove" className={styles.approve}>
            Infinite approve
          </label>
        </div>
      </div>
    </div>
  );
