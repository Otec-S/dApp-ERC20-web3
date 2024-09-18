import { useEffect, useState } from 'react';
import { GetBalanceReturnType, getBalance } from 'wagmi/actions';
// FIXME: замените на стандартный конфиг wagmiConfig
import { config } from '../../testWagmiConfig';
import { formatUnits } from 'viem/utils';

interface IUseBalanceResult {
  balance: string | null;
  loading: boolean;
  error: Error | null;
}

const useBalanceCustom = (address: `0x${string}`): IUseBalanceResult => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const balanceData: GetBalanceReturnType = await getBalance(config, {
          address,
        });
        const balanceInEth = formatUnits(balanceData.value, 18);
        setBalance(balanceInEth);
      } catch (err) {
        setError(err as Error);
        console.error('Error retrieving balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, loading, error };
};

export default useBalanceCustom;
