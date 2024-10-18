import { Address } from 'viem';

export const nftContractAddress: Address = '0x0b86cB8C778a33659434B70c72Aa3A53033BCC76';

export interface Proofs {
  airdrop: Proof[];
  private: Proof[];
}

export interface Proof {
  address: Address;
  proof: Array<string>;
}
