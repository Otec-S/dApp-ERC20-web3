import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* тут конфиг из wagmi  */}
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          // TODO: добавил initialChain
          initialChain={3}
          modalSize="compact"
          theme={darkTheme({
            accentColor: '#2D4BC1',
            accentColorForeground: '#FFF',
            borderRadius: 'small',
            overlayBlur: 'small',
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
