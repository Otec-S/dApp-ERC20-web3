import { useEffect, useState } from 'react';
import { formatUnits } from 'viem/utils';
import { getBalance, GetBalanceReturnType } from 'wagmi/actions';

import { config } from '../../wagmiConfig';

interface Props {
  balance: string | null;
  loadingBalanceCustom: boolean;
  errorBalanceCustom: Error | null;
  decimals: number;
}

const useBalanceCustom = (address: `0x${string}`, token: `0x${string}`, decimals: number): Props => {
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
          token,
        });
        const balanceInEth = formatUnits(balanceData.value, decimals);
        setBalance(balanceInEth);
      } catch (err) {
        setErrorBalanceCustom(err as Error);
        setBalance('Error retrieving balance');
      } finally {
        setLoadingBalanceCustom(false);
      }
    };

    fetchBalance();
  }, [address, token, decimals]);

  return { balance, decimals, loadingBalanceCustom, errorBalanceCustom };
};

export default useBalanceCustom;
