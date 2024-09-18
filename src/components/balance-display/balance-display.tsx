import { FC, useEffect, useState } from 'react';
import { GetBalanceReturnType, getBalance } from 'wagmi/actions';
// FIXME: замени на стандартный конфиг wagmiConfig
// import { config } from '../../../testWagmiConfig';
import { config } from '../../../wagmiConfig';
import { formatUnits } from 'viem/utils';

const BalanceDisplay: FC = () => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData: GetBalanceReturnType = await getBalance(config, {
          // TODO: подставляем адрес кошелька
          address: '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054',
        });
        const balanceInEth = formatUnits(balanceData.value, 18);
        setBalance(balanceInEth);
      } catch (err) {
        console.error('Error retrieving balance:', err);
      }
    };

    fetchBalance();
  }, [config]);

  return <>{balance ? <span>{balance}</span> : <span>Loading...</span>}</>;
};

export default BalanceDisplay;
