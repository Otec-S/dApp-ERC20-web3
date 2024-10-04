import { Address } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';

export const polygonContractAddress: Address = '0x30bbAA44F7A80AfC9a5CB1aEEb8247B8E2aDE392';
export const sepoliaContractAddress: Address = '0x9CE9DFFA60c558E22178172DDa1774234AECAEBd';

export const tradeContractAddress: Record<string, Address> = {
  [`${polygonAmoy.id}`]: '0x30bbAA44F7A80AfC9a5CB1aEEb8247B8E2aDE392',
  [`${sepolia.id}`]: '0x9CE9DFFA60c558E22178172DDa1774234AECAEBd',
};

export const SEPOLIA_URL = 'http://sepolia.etherscan.io';
export const POLYGON_AMOY_URL = 'http://amoy.polygonscan.com';
