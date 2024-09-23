import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import cn from 'classnames';

import { logo } from '@assets/images';

import styles from './Header.module.css';

interface Props {
  colorScheme?: 'default' | 'yellow';
}

const Header: FC<Props> = ({ colorScheme }) => {
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
      <img
        className={cn(styles.img, { [styles.imgBurgerIsOpen]: burgerIsOpen })}
        src={logo.default}
        alt="Project logo"
      />
      <div className={cn(styles.body, { [styles.bodyBurgerIsOpen]: burgerIsOpen })}>
        <nav className={cn(styles.nav, { [styles.navBurgerIsOpen]: burgerIsOpen })}>
          <NavLink className={styles.navLink} to="/erc20send">
            Send ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            Trade ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            NFT Collection
          </NavLink>
        </nav>
        <div
          className={cn(styles.connectButtonWrapper, {
            [styles.connectButtonWrapperYellowScheme]: colorScheme === 'yellow',
          })}
        >
          <ConnectButton label="Connect wallet" chainStatus={'none'} showBalance={false} accountStatus="address" />
        </div>
      </div>
    </header>
  );
};

export default Header;
