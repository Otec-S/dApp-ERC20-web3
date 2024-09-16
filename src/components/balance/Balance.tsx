// Balance.tsx
import React from 'react';
import { useAccount, useBalance } from 'wagmi';

const Balance: React.FC = () => {
  const { isConnected, address } = useAccount();

  // Получаем баланс для текущего кошелька
  const {
    data: balanceData,
    isLoading,
    error,
  } = useBalance({
    address,
  });

  if (!isConnected) {
    return <div>Please connect your wallet.</div>;
  }

  return (
    <div>
      <h2>Your Balance</h2>
      {isLoading ? (
        <p>Loading balance...</p>
      ) : error ? (
        <p>Error fetching balance: {error.message}</p>
      ) : (
        <p>
          Balance: {balanceData?.formatted} ETH
          <br />
          (Raw: {balanceData?.amount} wei)
        </p>
      )}
    </div>
  );
};

export default Balance;
