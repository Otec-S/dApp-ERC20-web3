import { NavLink } from "react-router-dom";
import styles from './Header.module.css';
import '@rainbow-me/rainbowkit/styles.css';
import './Burger.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { slide as BurgerMenu } from 'react-burger-menu';

import imgUrl from '../../assets/logo.svg';

const Header = (): React.ReactElement => {

  return (
    <header className={styles.header}>
      <div className={styles.burgerWrapper}>
        <BurgerMenu >
          <NavLink className={styles.navLink} to="/">
            Send ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            Trade ERC-20
          </NavLink>
          <NavLink className={styles.navLink} to="/">
            NFT Collection
          </NavLink>
        </BurgerMenu>
      </div>
      <img src={imgUrl} alt="Project logo" />
      <div className={styles.body}>
        <nav className={styles.nav}>
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
        <ConnectButton label="Connect wallet" showBalance={false}/>
      </div>
    </header>
  );
};

export default Header;
