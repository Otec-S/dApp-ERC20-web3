// ClaimToken.tsx
import { useAccount, useWriteContract } from 'wagmi';
import { abi } from '../../helpers/abi';
import { FC } from 'react';

// ABI вашего контракта TetherToken
const tetherTokenABI = ['function claim() public'];

// Адрес вашего контракта
const tetherTokenAddress = '0x8aC43Ed0652168827FA3906577dD44e4819B11D1';

const ClaimToken: FC = () => {
  const { isConnected } = useAccount();

  // const { data, isLoading, isSuccess, writeContract } = useWriteContract({
  //   address: tetherTokenAddress,
  //   abi: tetherTokenABI,
  //   functionName: 'claim',
  // });

  const { writeContract } = useWriteContract();

  // const { isSuccess: isTxSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // });

  return (
    // <div>
    //   {isConnected ? (
    //     <>
    //       <button onClick={handleClaim} disabled={isLoading}>
    //         {isLoading ? 'Claiming...' : 'Claim Tokens'}
    //       </button>
    //       {isSuccess && <p>Transaction successful! Hash: {data?.hash}</p>}
    //       {isTxSuccess && <p>Claim successful!</p>}
    //     </>
    //   ) : (
    //     <p>Please connect your MetaMask wallet.</p>
    //   )}
    // </div>
    <button
      onClick={() =>
        writeContract({
          abi,
          address: { tetherTokenAddress },
          functionName: 'claimTokens',
          args: ['0x8aC43Ed0652168827FA3906577dD44e4819B11D1', '0x9c7c832BEDA90253D6B971178A5ec8CdcB7C9054'],
        })
      }
    >
      Transfer
    </button>
  );
};

export default ClaimToken;
