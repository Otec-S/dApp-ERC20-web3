import { FC } from 'react';

import styles from './AdminSaleForm.module.css';

export const AdminSaleForm: FC = () => {
  return (
    <>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select airdrop state:</legend>
        <div>
          <input type="radio" id="airdrope0" name="airdrope" value="0" />
          <label className={styles.label} htmlFor="airdrope0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="airdrope1" name="airdrope" value="1" />
          <label className={styles.label} htmlFor="airdrope1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="airdrope2" name="airdrope" value="2" />
          <label className={styles.label} htmlFor="airdrope2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select white list state:</legend>
        <div>
          <input type="radio" id="whitelist0" name="whitelist" value="0" />
          <label className={styles.label} htmlFor="whitelist0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="whitelist1" name="whitelist" value="1" />
          <label className={styles.label} htmlFor="whitelist1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="whitelist2" name="whitelist" value="2" />
          <label className={styles.label} htmlFor="whitelist2">
            Finished
          </label>
        </div>
      </fieldset>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.label}>Select public sale state:</legend>
        <div>
          <input type="radio" id="publicSale0" name="publicSale" value="0" />
          <label className={styles.label} htmlFor="publicSale0">
            Soon
          </label>
        </div>
        <div>
          <input type="radio" id="publicSale1" name="publicSale" value="1" />
          <label className={styles.label} htmlFor="publicSale1">
            Available
          </label>
        </div>
        <div>
          <input type="radio" id="publicSale2" name="publicSale" value="2" />
          <label className={styles.label} htmlFor="publicSale2">
            Finished
          </label>
        </div>
      </fieldset>
    </>
  );
};
