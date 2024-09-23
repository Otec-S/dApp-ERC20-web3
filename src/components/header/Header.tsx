import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import cn from 'classnames';

import { logo,logoYellowScheme } from '@assets/images';

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
          className={cn(styles.burger, { [styles.burgerIsOpen]: burgerIsOpen})}
          onClick={handleBurgerClick}
        >
          <div className={cn(styles.burgerImage,{[styles.burgerImageYellowScheme]: colorScheme==='yellow' })} />
        </button>
      </div>
      <img
        className={cn(styles.img, { [styles.imgBurgerIsOpen]: burgerIsOpen})}
        src={colorScheme === 'yellow' ? logoYellowScheme.default : logo.default}
        alt="Project logo"
      />
      <div className={cn(styles.body, { [styles.bodyBurgerIsOpen]: burgerIsOpen })}>
        <nav className={cn(styles.nav, { [styles.navBurgerIsOpen]: burgerIsOpen })}>
          <NavLink className={cn(styles.navLink,{[styles.navLinkYellowScheme]:colorScheme === 'yellow'})} to="/erc20send">
            Send ERC-20
          </NavLink>
          <NavLink className={cn(styles.navLink,{[styles.navLinkYellowScheme]:colorScheme === 'yellow'})} to="/">
            Trade ERC-20
          </NavLink>
          <NavLink className={cn(styles.navLink,{[styles.navLinkYellowScheme]:colorScheme === 'yellow'})} to="/">
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
