import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme  } from '@rainbow-me/rainbowkit';
import { config } from '../wagmiConfig.ts';
import Header from './components/header/Header';

import './App.css';

const queryClient = new QueryClient();

const App = () => {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <RainbowKitProvider 
          modalSize="compact" 
          theme={darkTheme({  accentColor: '#2D4BC1',
                              accentColorForeground: '#FFF',
                              borderRadius: 'small',
                              overlayBlur: 'small',
                            })
                }
        >
          <Header/>
        </RainbowKitProvider>
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default App
