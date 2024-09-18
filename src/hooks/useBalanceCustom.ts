import { useEffect, useState } from 'react';
import { GetBalanceReturnType, getBalance } from 'wagmi/actions';
// FIXME: замените на стандартный конфиг wagmiConfig
import { config } from '../../testWagmiConfig';
import { formatUnits } from 'viem/utils';

interface IUseBalanceResult {
  balance: string | null;
  loadingBalanceCustom: boolean;
  errorBalanceCustom: Error | null;
}

const useBalanceCustom = (address: `0x${string}`): IUseBalanceResult => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalanceCustom, setLoadingBalanceCustom] = useState<boolean>(true);
  const [errorBalanceCustom, setErrorBalanceCustom] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoadingBalanceCustom(true);
      setErrorBalanceCustom(null);
      try {
        const balanceData: GetBalanceReturnType = await getBalance(config, {
          address,
        });
        const balanceInEth = formatUnits(balanceData.value, 18);
        setBalance(balanceInEth);
      } catch (err) {
        setErrorBalanceCustom(err as Error);
        console.error('Error retrieving balance:', err);
      } finally {
        setLoadingBalanceCustom(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, loadingBalanceCustom, errorBalanceCustom };
};

export default useBalanceCustom;
