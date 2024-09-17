import { polygon, mainnet, sepolia, polygonAmoy } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Scrum Team 17 web3 kEthers fans',
  projectId: import.meta.env.VITE_WAGMI_PROJECT_ID,
  chains: [mainnet, polygon, sepolia, polygonAmoy],
  // TODO: добавил транспорты
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});


