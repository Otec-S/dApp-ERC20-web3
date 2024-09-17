import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount, WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
// TODO: заменить wagmiConfig на testWagmiConfig
// import { config } from '../wagmiConfig';
import { config } from '../testWagmiConfig';
import { Landing } from './pages/Landing';
import './App.css';
import './index.css';

const queryClient = new QueryClient();
const rainbowtTheme = darkTheme({
  accentColor: '#2D4BC1',
  accentColorForeground: '#FFF',
  borderRadius: 'small',
  overlayBlur: 'small',
});
import SendERC20 from './pages/SendERC20/send-ERC-20';
// import { Profile } from './components/test-profile/test-profile';
import { WalletOptions } from './components/test-profile/test-wallet-options';
import { Account } from './components/test-profile/test-accaunt';

// TODO:
function ConnectWallet() {
  const { isConnected } = useAccount();
  console.log('isConnected', isConnected);
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/send-ERC20-tokens',
    element: <SendERC20 />,
  },
  // TODO: тест
  {
    path: '/profile',
    element: <ConnectWallet />,
  },
  // TODO: тест
  // {
  //   path: '/balance',
  //   element: <ReadContract />,
  // },
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
