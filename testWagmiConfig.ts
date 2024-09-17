import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

// Используйте import.meta.env для доступа к переменной окружения
// const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID;
// const projectId = '60e77a926fcdd784897829d66c6dc30e';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
