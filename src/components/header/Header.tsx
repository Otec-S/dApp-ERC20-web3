import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import { FC, useState } from 'react';
import classNames from 'classnames';
import '@rainbow-me/rainbowkit/styles.css';

import imgUrl from '../../assets/images/logo.svg';
import styles from './Header.module.css';

const Header: FC = () => {
  const [burgerIsOpen, setBurgerIsOpen] = useState(false);
  const handleBurgerClick = () => {
    setBurgerIsOpen((prev) => !prev);
  };
  return (
    <header className={styles.header}>
      <div className={styles.burgerWrapper}>
        <button
          type="button"
          className={classNames({[styles.burger]:true},{[styles.burgerIsOpen]:burgerIsOpen})}
          onClick={handleBurgerClick}
        >
          <div className={styles.burgerImage} />
        </button>
      </div>
      <img className={classNames({[styles.img]:true},{[styles.imgBurgerIsOpen]:burgerIsOpen})} src={imgUrl} alt="Project logo" />
      <div className={classNames({[styles.body]:true},{[styles.bodyBurgerIsOpen]:burgerIsOpen})}>
        <nav className={classNames({[styles.nav]:true},{[styles.navBurgerIsOpen]:burgerIsOpen})}>
          <NavLink className={styles.navLink} to="/">
            Send ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            Trade ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            NFT Collection
          </NavLink>
        </nav>
        <div className={styles.connectButtonWrapper}>
          <ConnectButton label="Connect wallet" chainStatus={'none'} showBalance={false} accountStatus="address" />
        </div>
      </div>
    </header>
  );
};

export default Header;
