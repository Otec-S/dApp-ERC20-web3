import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import { FC, useState } from 'react';
import cn from 'classnames';
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
          className={cn(styles.burger, { [styles.burgerIsOpen]: burgerIsOpen })}
          onClick={handleBurgerClick}
        >
          <div className={styles.burgerImage} />
        </button>
      </div>
      <img className={cn(styles.img, { [styles.imgBurgerIsOpen]: burgerIsOpen })} src={imgUrl} alt="Project logo" />
      <div className={cn(styles.body, { [styles.bodyBurgerIsOpen]: burgerIsOpen })}>
        <nav className={cn(styles.nav, { [styles.navBurgerIsOpen]: burgerIsOpen })}>
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
