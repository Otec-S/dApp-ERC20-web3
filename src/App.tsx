import { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { config } from '../wagmiConfig';
import { Landing } from './pages/Landing';
import SendERC20 from './pages/SendERC20/send-ERC-20';
import { SEND_ERC20_ROUT } from './shared/constants';
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
    path: '/',
    element: <Landing />,
  },
  {
    path: SEND_ERC20_ROUT,
    element: <SendERC20 />,
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
