import { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { config } from '../wagmiConfig';
import { TokenPopup } from './components/TokenPopup/TokenPopup';
// FIXME:
// import { ERC20send } from './pages/ERC20send/ERC20send';
import { Landing } from './pages/Landing';
import SendERC20 from './pages/SendERC20/send-ERC-20';
import './App.module.css';
import './index.module.css';

const queryClient = new QueryClient();
const rainbowtTheme = darkTheme({
  accentColor: '#2D4BC1',
  accentColorForeground: '#FFF',
  borderRadius: 'small',
  overlayBlur: 'small',
});

// FIXME:
// Простая функция-заглушка для закрытия попапа
const handleOnClose = () => {
  console.log('Popup closed');
};

// Простая функция-заглушка для выбора токена
const handleOnSelect = (token) => {
  console.log('Token selected:', token.name);
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  // FIXME:
  // {
  //   path: '/erc20send',
  //   element: <ERC20send />,
  // },
  {
    path: '/send-ERC20-tokens',
    element: <SendERC20 />,
  },
  // FIXME:
  {
    path: '/tp',
    element: <TokenPopup onCLose={handleOnClose} onSelect={handleOnSelect} />,
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
