import React, { useEffect, useState } from 'react';
import { formatEther } from 'viem';

import { publicClient } from './client'; // убедитесь, что путь к вашему клиенту правильный

const TokenBalance: React.FC<{ address: `0x${string}` }> = ({ address }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const balance = await publicClient.getBalance({
          address,
        });

        // Преобразуем баланс в эфир
        setBalance(formatEther(balance));
        // setBalance(balance.toString());
      } catch (err) {
        console.error(err);
        setError('Ошибка получения баланса.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <h2>
      Баланс адреса {address}: {balance}
    </h2>
  );
};

export default TokenBalance;

// Используйте компонент, передавая адрес в качестве пропса
// const App: React.FC = () => {
//   return (
//     <div>
//       <h1>Проверка баланса Ethereum</h1>
//       <TokenBalance address="0x8aC43Ed0652168827FA3906577dD44e4819B11D1" />
//     </div>
//   );
// };
