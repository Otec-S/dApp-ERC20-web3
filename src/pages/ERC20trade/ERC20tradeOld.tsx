// import { FC } from 'react';
// import { Outlet } from 'react-router-dom';
// // import { Outlet } from 'react-router-dom';
// import { useConnectModal } from '@rainbow-me/rainbowkit';
// import { OffersTable } from '@src/components/offers-table/offers-table';
// import EnhancedTable from '@src/components/offers-table/test-table';
// import { useAccount } from 'wagmi';

// import Header from '@components/header/Header';
// import { Tabs } from '@components/tabs/Tabs';

// import styles from './ERC20trade.module.css';

// export const ERC20trade: FC = () => {
//   const { isConnected } = useAccount();
//   const { openConnectModal } = useConnectModal();

//   if (!isConnected && openConnectModal) {
//     openConnectModal();
//   }

//   return (
//     <div className={styles.pageWrap}>
//       <div className={styles.header}>
//         <Header colorScheme="lightBackground" />
//         <Tabs />
//       </div>
//       <div className={styles.container}>
//         <Outlet />
//       </div>
//       {/* FIXME: */}
//       {/* <NewOfferForm /> */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
//         <OffersTable />
//         {/* <EnhancedTable /> */}
//       </div>
//     </div>
//   );
// };
