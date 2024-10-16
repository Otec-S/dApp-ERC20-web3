import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';
import { useReadContracts } from 'wagmi';

import { WithTip } from '@components/with-tip/WithTip';
import { nftContractAbi, ROUTES } from '@shared/constants';
import { useChainDependentValues } from '@shared/hooks';

import { SaleStatus } from './SideMenu.interface';
import { getStatus } from './SideMenu.utils';
import styles from './SideMenu.module.css';

export const SideMenu: FC = () => {
  const { pathname } = useLocation();
  const { nftContractAddress } = useChainDependentValues();

  const { data } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: nftContractAddress,
        functionName: 'airDrop',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'whiteListSale',
        abi: nftContractAbi,
      },
      {
        address: nftContractAddress,
        functionName: 'publicSale',
        abi: nftContractAbi,
      },
    ],
  });

  const [airDropStatus, preSaleStatus, publicSaleStatus] = data || [];

  const sideMenuRoutes = [
    { name: 'AirDrop', link: ROUTES.AIRDROP, status: getStatus(airDropStatus) },
    { name: 'Private Presale', link: ROUTES.PRESALE, status: getStatus(preSaleStatus) },
    { name: 'Public Sale', link: ROUTES.PUBLIC_SALE, status: getStatus(publicSaleStatus) },
    { name: 'My NFTs', link: ROUTES.COLLECTION },
  ];

  const handleClickNav = (status?: SaleStatus | null) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status === SaleStatus.SOON || status === SaleStatus.FINISHED) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.sideMenu}>
      {sideMenuRoutes.map((item) => (
        <WithTip text={item.status ?? ''} isDisabled={item.status === SaleStatus.SOON} key={item.name}>
          <NavLink
            to={item.link}
            className={cn(styles.link, {
              [styles.linkActive]: pathname.includes(item.link),
              [styles.linkDisabled]: item.status === SaleStatus.SOON || item.status === SaleStatus.FINISHED,
            })}
            onClick={handleClickNav(item.status)}
          >
            <p className={styles.linkText}>{item.name}</p>
          </NavLink>
        </WithTip>
      ))}
    </div>
  );
};
