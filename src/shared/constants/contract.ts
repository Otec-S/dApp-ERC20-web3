import { Address } from 'viem';
import { polygonAmoy, sepolia } from 'viem/chains';

export const polygonContractAddress: Address = '0x2Ff9FdF99E99108C32c249589E99C874fF4B0c8F';
export const sepoliaContractAddress: Address = '0x834a3440bD1813f7B8618e96909Ce11b7C6240b2';

export const tradeContractAddress: Record<string, Address> = {
  [`${polygonAmoy.id}`]: '0x2Ff9FdF99E99108C32c249589E99C874fF4B0c8F',
  [`${sepolia.id}`]: '0x834a3440bD1813f7B8618e96909Ce11b7C6240b2',
};

export const SEPOLIA_URL = 'http://sepolia.etherscan.io';
export const POLYGON_AMOY_URL = 'http://amoy.polygonscan.com';
