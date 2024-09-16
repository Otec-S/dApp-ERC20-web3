import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import { FC, useState } from 'react';
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
          className={burgerIsOpen ? styles.burgerIsOpen : styles.burger}
          onClick={handleBurgerClick}
        >
          <div className={styles.burgerImage} />
        </button>
      </div>
      <img className={burgerIsOpen ? styles.imgBurgerIsOpen : styles.img} src={imgUrl} alt="Project logo" />
      <div className={burgerIsOpen ? styles.bodyBurgerIsOpen : styles.body}>
        <nav className={burgerIsOpen ? styles.navBurgerIsOpen : styles.nav}>
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
          <ConnectButton label="Connect wallet" chainStatus={'full'} showBalance={false} accountStatus="full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
