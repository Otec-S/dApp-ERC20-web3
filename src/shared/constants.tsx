import { ReactElement } from 'react';
import { Address } from 'viem';

import ARBIcon from '@assets/icons/arb.svg';
import DAIIcon from '@assets/icons/dai.svg';
import DOGEIcon from '@assets/icons/doge.svg';
import LINKIcon from '@assets/icons/link.svg';
import OPIcon from '@assets/icons/op.svg';
import PEPEIcon from '@assets/icons/pepe.svg';
import TRXIcon from '@assets/icons/trx.svg';
import USDCIcon from '@assets/icons/usdc.svg';
import USDTIcon from '@assets/icons/usdt.svg';
import WBTSIcon from '@assets/icons/wbtc.svg';

export interface Token {
  id: number;
  name: string;
  sepoliaAddress: Address;
  polygonAddress: Address;
  icon: ReactElement;
  decimals: number;
}

export interface TokenData {
  requestWasSuccessful: boolean;
  tokenAddress?: Address;
  tokenName?: string;
  tokenDecimals?: number;
  tokenBalance?: bigint;
}

export const ROUTES = {
  HOME: '/',
  SEND_ERC20: '/send-ERC20-tokens',
};

export const SEPOLIA_URL = 'http://sepolia.etherscan.io';
export const POLYGON_AMOY_URL = 'http://amoy.polygonscan.com';

export const tokens: Token[] = [
  {
    id: 1,
    name: 'ARB',
    sepoliaAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    polygonAddress: '0x34cd8b477eb916c1c4224b2FFA80DE015cCC671b',
    icon: <ARBIcon />,
    decimals: 18,
  },
  {
    id: 2,
    name: 'DAI',
    sepoliaAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    polygonAddress: '0x1519d41F48F3621bCd583aa646C95217F87D3A99',
    icon: <DAIIcon />,
    decimals: 18,
  },
  {
    id: 3,
    name: 'DOGE',
    sepoliaAddress: '0xd409ffeb2f2e9dB0A75483a6417776CD6D7Ce774',
    polygonAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    icon: <DOGEIcon />,
    decimals: 18,
  },
  {
    id: 4,
    name: 'LINK',
    sepoliaAddress: '0x53BB015921600B6E4b373125B90143090F957d50',
    polygonAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    icon: <LINKIcon />,
    decimals: 18,
  },
  {
    id: 5,
    name: 'OP',
    sepoliaAddress: '0x54d412Fee228E13A42F38bC760faEFfDFE838536',
    polygonAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    icon: <OPIcon />,
    decimals: 18,
  },
  {
    id: 6,
    name: 'PEPE',
    sepoliaAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    polygonAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    icon: <PEPEIcon />,
    decimals: 18,
  },
  {
    id: 7,
    name: 'TRX',
    sepoliaAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    polygonAddress: '0xEe7356FB1362fD659D03892719d424Bd8D9D8f70',
    icon: <TRXIcon />,
    decimals: 18,
  },
  {
    id: 8,
    name: 'USDT',
    sepoliaAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    polygonAddress: '0x0a6DFA1eEf85B94E7e753bA222A6AcF2aE6C1a8b',
    icon: <USDTIcon />,
    decimals: 6,
  },
  {
    id: 9,
    name: 'USDC',
    sepoliaAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    polygonAddress: '0x6fD3B0bfB19Dc9C02f79E1e6E32444A390842700',
    icon: <USDCIcon />,
    decimals: 6,
  },
  {
    id: 10,
    name: 'WBTC',
    sepoliaAddress: '0x8805B377F0a28846198e81120179C4Ca5c6D5318',
    polygonAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    icon: <WBTSIcon />,
    decimals: 8,
  },
];

export const contractAbi = [
  {
    inputs: [{ internalType: 'uint256', name: '_feeBasisPoints', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenFrom', type: 'address' },
          { internalType: 'address', name: 'tokenTo', type: 'address' },
          { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'optionalTaker', type: 'address' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
        ],
        indexed: true,
        internalType: 'struct TrustlessOTC.TradeOffer',
        name: 'tradeOffer',
        type: 'tuple',
      },
    ],
    name: 'OfferCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenFrom', type: 'address' },
          { internalType: 'address', name: 'tokenTo', type: 'address' },
          { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'optionalTaker', type: 'address' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
        ],
        indexed: true,
        internalType: 'struct TrustlessOTC.TradeOffer',
        name: 'tradeOffer',
        type: 'tuple',
      },
    ],
    name: 'OfferCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenFrom', type: 'address' },
          { internalType: 'address', name: 'tokenTo', type: 'address' },
          { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'optionalTaker', type: 'address' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
        ],
        indexed: true,
        internalType: 'struct TrustlessOTC.TradeOffer',
        name: 'tradeOffer',
        type: 'tuple',
      },
    ],
    name: 'OfferTaken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceTracker',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'tradeID', type: 'uint256' }],
    name: 'cancelTrade',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'contract IERC20', name: '_token', type: 'address' }],
    name: 'claimFees',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'feeBasisPoints',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'feeTracker',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'tradeID', type: 'uint256' }],
    name: 'getOfferDetails',
    outputs: [
      { internalType: 'address', name: '_tokenFrom', type: 'address' },
      { internalType: 'address', name: '_tokenTo', type: 'address' },
      { internalType: 'uint256', name: '_amountFrom', type: 'uint256' },
      { internalType: 'uint256', name: '_amountTo', type: 'uint256' },
      { internalType: 'address', name: '_creator', type: 'address' },
      { internalType: 'uint256', name: '_fee', type: 'uint256' },
      { internalType: 'address', name: '_optionalTaker', type: 'address' },
      { internalType: 'bool', name: '_active', type: 'bool' },
      { internalType: 'bool', name: '_completed', type: 'bool' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getOptionalTakerTrades',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenFrom', type: 'address' },
          { internalType: 'address', name: 'tokenTo', type: 'address' },
          { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'optionalTaker', type: 'address' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
        ],
        internalType: 'struct TrustlessOTC.TradeOffer[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTrades',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenFrom', type: 'address' },
          { internalType: 'address', name: 'tokenTo', type: 'address' },
          { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'optionalTaker', type: 'address' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
        ],
        internalType: 'struct TrustlessOTC.TradeOffer[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_tokenFrom', type: 'address' },
      { internalType: 'address', name: '_tokenTo', type: 'address' },
      { internalType: 'uint256', name: '_amountFrom', type: 'uint256' },
      { internalType: 'uint256', name: '_amountTo', type: 'uint256' },
      { internalType: 'address', name: '_optionalTaker', type: 'address' },
    ],
    name: 'initiateTrade',
    outputs: [{ internalType: 'uint256', name: 'newTradeID', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'offers',
    outputs: [
      { internalType: 'address', name: 'tokenFrom', type: 'address' },
      { internalType: 'address', name: 'tokenTo', type: 'address' },
      { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
      { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
      { internalType: 'address payable', name: 'creator', type: 'address' },
      { internalType: 'address', name: 'optionalTaker', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'bool', name: 'completed', type: 'bool' },
      { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'optionalTradeTracker',
    outputs: [
      { internalType: 'address', name: 'tokenFrom', type: 'address' },
      { internalType: 'address', name: 'tokenTo', type: 'address' },
      { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
      { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
      { internalType: 'address payable', name: 'creator', type: 'address' },
      { internalType: 'address', name: 'optionalTaker', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'bool', name: 'completed', type: 'bool' },
      { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'contract IERC20', name: '_token', type: 'address' }],
    name: 'reclaimToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'tradeID', type: 'uint256' }],
    name: 'take',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'tradeTracker',
    outputs: [
      { internalType: 'address', name: 'tokenFrom', type: 'address' },
      { internalType: 'address', name: 'tokenTo', type: 'address' },
      { internalType: 'uint256', name: 'amountFrom', type: 'uint256' },
      { internalType: 'uint256', name: 'amountTo', type: 'uint256' },
      { internalType: 'address payable', name: 'creator', type: 'address' },
      { internalType: 'address', name: 'optionalTaker', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'bool', name: 'completed', type: 'bool' },
      { internalType: 'uint256', name: 'tradeID', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
