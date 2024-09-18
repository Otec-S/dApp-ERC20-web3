import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { GetBalanceReturnType, getBalance } from 'wagmi/actions';
// import { config } from '../../../testWagmiConfig';
import { config } from '../../../wagmiConfig';
import { formatUnits } from 'viem/utils';

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData: GetBalanceReturnType = await getBalance(config, {
          address: '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054',
        });
        const balanceInEth = formatUnits(balanceData.value, 18);
        setBalance(balanceInEth);
      } catch (err) {
        console.error('Ошибка при получении баланса:', err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <h2>{ensName ? `${ensName} (${address})` : address}</h2>}
      {balance ? <p>Balance: {balance}</p> : <p>Loading balance...</p>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
