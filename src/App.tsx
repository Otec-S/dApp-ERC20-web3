import { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { ERC20trade } from '@pages/ERC20trade/ERC20trade';
import { CreateOffer } from '@pages/ERC20trade/tabs/CreateOffer';
import { History } from '@pages/ERC20trade/tabs/History';
import { MyOffers } from '@pages/ERC20trade/tabs/MyOffers';
import { Landing } from '@pages/Landing';
import SendERC20 from '@pages/SendERC20/send-ERC-20';
import { ROUTES } from '@shared/constants';

import { config } from '../wagmiConfig';
import './App.module.css';
import './index.module.css';

const queryClient = new QueryClient();
const rainbowtTheme = darkTheme({
  accentColor: '#2D4BC1',
  accentColorForeground: '#FFF',
  borderRadius: 'small',
  overlayBlur: 'small',
});

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Landing />,
  },
  {
    path: ROUTES.SEND_ERC20,
    element: <SendERC20 />,
  },
  {
    path: ROUTES.ERC20_TRADE,
    element: <ERC20trade />,
    children: [
      { path: ROUTES.CREATE_OFFER, element: <CreateOffer /> },
      { path: ROUTES.MY_OFFERS, element: <MyOffers /> },
      { path: ROUTES.HISTORY, element: <History /> },
    ],
  },
  {
    path: ROUTES.NFT_COLLECTION,
    element: <Landing />,
  },
]);

const App: FC = () => {
  return (
    <div className="app">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact" theme={rainbowtTheme}>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
};

export default App;
