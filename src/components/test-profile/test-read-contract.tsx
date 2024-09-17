import { type BaseError, useReadContract } from 'wagmi';
import { config } from '../../../testWagmiConfig';

export function ReadContract() {
  const {
    data: balance,
    error,
    isPending,
  } = useReadContract({
    ...config,
    functionName: 'balanceOf',
    args: ['0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054'],
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {(error as unknown as BaseError).shortMessage || error.message}</div>;

  return <div>Balance: {balance?.toString()}</div>;
}
