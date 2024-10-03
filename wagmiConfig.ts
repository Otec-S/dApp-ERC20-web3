import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from '@wagmi/core';
import { mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Scrum Team 17 web3 kEthers fans',
  projectId: import.meta.env.VITE_WAGMI_PROJECT_ID,
  chains: [mainnet, polygon, sepolia, polygonAmoy],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/5opf7-1xwOLzLDlRFmXAeQgbPdymDv02'),
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/5opf7-1xwOLzLDlRFmXAeQgbPdymDv02'),
    [polygonAmoy.id]: http('https://polygon-amoy.g.alchemy.com/v2/5opf7-1xwOLzLDlRFmXAeQgbPdymDv02'),
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/5opf7-1xwOLzLDlRFmXAeQgbPdymDv02'),
  },
});
