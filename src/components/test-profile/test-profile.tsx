import { useAccount, useEnsName } from 'wagmi';
import { WalletOptions } from './test-wallet-options';

export function Profile() {
  const { address } = useAccount();
  const { data, error, status } = useEnsName({ address });
  if (status === 'pending') return <div>Loading ENS name</div>;
  if (status === 'error') return <div>Error fetching ENS name: {error.message}</div>;
  return (
    <>
      <h2>ENS name: {data}</h2>
      <h2>Address: {address}</h2>
      <h2>Data: {data}</h2>
      <h2>Status: {status}</h2>
      <WalletOptions />
    </>
  );
}
