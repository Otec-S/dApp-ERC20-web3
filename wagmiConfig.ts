import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from '@wagmi/core';
import { arbitrumSepolia, mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Scrum Team 17 web3 kEthers fans',
  projectId: import.meta.env.VITE_WAGMI_PROJECT_ID,
  chains: [mainnet, polygon, sepolia, polygonAmoy, arbitrumSepolia],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
    [polygon.id]: http(import.meta.env.VITE_POLYGON_RPC_URL),
    [polygonAmoy.id]: http(import.meta.env.VITE_POLYGON_AMOY_RPC_URL),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
  },
});
