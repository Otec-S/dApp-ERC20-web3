import { Offer } from './Offers-tables.types';

export function createData(offer: Offer): Offer {
  return {
    ...offer,
    rate: parseFloat(offer.rate.toFixed(2)),
  };
}

export const rows: Offer[] = [
  createData({
    id: 355157,
    fromTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    fromTokenName: 'PEPE',
    toTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    toTokenName: 'DOGE',
    amount1: 1000.0,
    amount2: 608000.21,
    rate: 608.21,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Open',
    receiver: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }),
  createData({
    id: 355158,
    fromTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    fromTokenName: 'ARB',
    toTokenAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    toTokenName: 'DAI',
    amount1: 500.0,
    amount2: 3000.0,
    rate: 60.0,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'Open',
    receiver: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  }),
  createData({
    id: 355159,
    fromTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    fromTokenName: 'LINK',
    toTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    toTokenName: 'OP',
    amount1: 100.0,
    amount2: 102.5,
    rate: 1.025,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'For me',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355160,
    fromTokenAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    fromTokenName: 'TRX',
    toTokenAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    toTokenName: 'PEPE',
    amount1: 250.0,
    amount2: 1250.0,
    rate: 5.0,
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
    status: 'Open',
    receiver: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
  }),
  createData({
    id: 355161,
    fromTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    fromTokenName: 'USDC',
    toTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    toTokenName: 'USDT',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'For me',
    receiver: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  }),
  createData({
    id: 355162,
    fromTokenAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    fromTokenName: 'WBTC',
    toTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    toTokenName: 'LINK',
    amount1: 7.5,
    amount2: 140.0,
    rate: 18.67,
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    status: 'Open',
    receiver: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
  }),
  createData({
    id: 355163,
    fromTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    fromTokenName: 'DAI',
    toTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    toTokenName: 'ARB',
    amount1: 3000.0,
    amount2: 500.0,
    rate: 0.16666666666666666,
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Open',
    receiver: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355164,
    fromTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    fromTokenName: 'USDT',
    toTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    toTokenName: 'USDC',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    status: 'For me',
    receiver: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
  }),
  createData({
    id: 355165,
    fromTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    fromTokenName: 'DOGE',
    toTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    toTokenName: 'PEPE',
    amount1: 608000.21,
    amount2: 1000.0,
    rate: 0.001643421052631579,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    status: 'For me',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
  }),
];

export const rowsHistory: Offer[] = [
  createData({
    id: 355166,
    fromTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    fromTokenName: 'PEPE',
    toTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    toTokenName: 'DOGE',
    amount1: 1000.0,
    amount2: 608000.21,
    rate: 608.21,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Cancelled',
    receiver: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }),
  createData({
    id: 355167,
    fromTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    fromTokenName: 'ARB',
    toTokenAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    toTokenName: 'DAI',
    amount1: 500.0,
    amount2: 3000.0,
    rate: 60.0,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'Cancelled',
    receiver: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  }),
  createData({
    id: 355168,
    fromTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    fromTokenName: 'LINK',
    toTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    toTokenName: 'OP',
    amount1: 100.0,
    amount2: 102.5,
    rate: 1.025,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Accepted',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355169,
    fromTokenAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    fromTokenName: 'TRX',
    toTokenAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    toTokenName: 'PEPE',
    amount1: 250.0,
    amount2: 1250.0,
    rate: 5.0,
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
    status: 'Cancelled',
    receiver: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
  }),
  createData({
    id: 355170,
    fromTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    fromTokenName: 'USDC',
    toTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    toTokenName: 'USDT',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'Accepted',
    receiver: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  }),
  createData({
    id: 355171,
    fromTokenAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    fromTokenName: 'WBTC',
    toTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    toTokenName: 'LINK',
    amount1: 7.5,
    amount2: 140.0,
    rate: 18.67,
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    status: 'Cancelled',
    receiver: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
  }),
  createData({
    id: 355172,
    fromTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    fromTokenName: 'DAI',
    toTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    toTokenName: 'ARB',
    amount1: 3000.0,
    amount2: 500.0,
    rate: 0.16666666666666666,
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Cancelled',
    receiver: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355173,
    fromTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    fromTokenName: 'USDT',
    toTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    toTokenName: 'USDC',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    status: 'Accepted',
    receiver: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
  }),
  createData({
    id: 355174,
    fromTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    fromTokenName: 'DOGE',
    toTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    toTokenName: 'PEPE',
    amount1: 608000.21,
    amount2: 1000.0,
    rate: 0.001643421052631579,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    status: 'Accepted',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
  }),
  createData({
    id: 355175,
    fromTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    fromTokenName: 'PEPE',
    toTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    toTokenName: 'DOGE',
    amount1: 1000.0,
    amount2: 608000.21,
    rate: 608.21,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Cancelled',
    receiver: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }),
  createData({
    id: 355176,
    fromTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    fromTokenName: 'ARB',
    toTokenAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    toTokenName: 'DAI',
    amount1: 500.0,
    amount2: 3000.0,
    rate: 60.0,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'Cancelled',
    receiver: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  }),
  createData({
    id: 355177,
    fromTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    fromTokenName: 'LINK',
    toTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    toTokenName: 'OP',
    amount1: 100.0,
    amount2: 102.5,
    rate: 1.025,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Accepted',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355178,
    fromTokenAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    fromTokenName: 'TRX',
    toTokenAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    toTokenName: 'PEPE',
    amount1: 250.0,
    amount2: 1250.0,
    rate: 5.0,
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
    status: 'Cancelled',
    receiver: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
  }),
  createData({
    id: 355179,
    fromTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    fromTokenName: 'USDC',
    toTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    toTokenName: 'USDT',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'Accepted',
    receiver: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  }),
  createData({
    id: 355180,
    fromTokenAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    fromTokenName: 'WBTC',
    toTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    toTokenName: 'LINK',
    amount1: 7.5,
    amount2: 140.0,
    rate: 18.67,
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    status: 'Cancelled',
    receiver: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
  }),
  createData({
    id: 355181,
    fromTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    fromTokenName: 'DAI',
    toTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    toTokenName: 'ARB',
    amount1: 3000.0,
    amount2: 500.0,
    rate: 0.16666666666666666,
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Cancelled',
    receiver: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355182,
    fromTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    fromTokenName: 'USDT',
    toTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    toTokenName: 'USDC',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    status: 'Accepted',
    receiver: '0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
  }),
  createData({
    id: 355183,
    fromTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    fromTokenName: 'DOGE',
    toTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    toTokenName: 'PEPE',
    amount1: 608000.21,
    amount2: 1000.0,
    rate: 0.001643421052631579,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    status: 'Accepted',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
  }),
  createData({
    id: 355184,
    fromTokenAddress: '0x0c02cb84eEF5f3EA61be9DfeC7F884dffc1fa6c0',
    fromTokenName: 'PEPE',
    toTokenAddress: '0x0de27cBf804F1665eBc2F927944f54aA70cB4fC1',
    toTokenName: 'DOGE',
    amount1: 1000.0,
    amount2: 608000.21,
    rate: 608.21,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Cancelled',
    receiver: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }),
  createData({
    id: 355185,
    fromTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    fromTokenName: 'ARB',
    toTokenAddress: '0xA68ecAb53bdcFdC753378a088CfB29d42915617E',
    toTokenName: 'DAI',
    amount1: 500.0,
    amount2: 3000.0,
    rate: 60.0,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'Cancelled',
    receiver: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  }),
  createData({
    id: 355186,
    fromTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    fromTokenName: 'LINK',
    toTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    toTokenName: 'OP',
    amount1: 100.0,
    amount2: 102.5,
    rate: 1.025,
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Accepted',
    receiver: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
  createData({
    id: 355187,
    fromTokenAddress: '0xd445682a9B9FE0aE4053056E005f9393413407e1',
    fromTokenName: 'TRX',
    toTokenAddress: '0x8903FE8C94F3b7db3482d53ccE000998d112cC7d',
    toTokenName: 'PEPE',
    amount1: 250.0,
    amount2: 1250.0,
    rate: 5.0,
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
    status: 'Cancelled',
    receiver: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
  }),
  createData({
    id: 355188,
    fromTokenAddress: '0x85d30853B690eEfa87854f240a81b4621b13FDF8',
    fromTokenName: 'USDC',
    toTokenAddress: '0x8aC43Ed0652168827FA3906577dD44e4819B11D1',
    toTokenName: 'USDT',
    amount1: 2000.0,
    amount2: 2000.0,
    rate: 1.0,
    hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'Accepted',
    receiver: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  }),
  createData({
    id: 355189,
    fromTokenAddress: '0x36Ea22735269Cb7AA2A931Dd871a73c0a9124f2B',
    fromTokenName: 'WBTC',
    toTokenAddress: '0xaa79133956a0F53Ef774c5b0e302784caF4A8Cc2',
    toTokenName: 'LINK',
    amount1: 7.5,
    amount2: 140.0,
    rate: 18.67,
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    status: 'Cancelled',
    receiver: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
  }),
  createData({
    id: 355190,
    fromTokenAddress: '0x8E4eCf56B8736A83CE17213187118231D3C06FFF',
    fromTokenName: 'DAI',
    toTokenAddress: '0xf300c9bf1A045844f17B093a6D56BC33685e5D05',
    toTokenName: 'ARB',
    amount1: 3000.0,
    amount2: 500.0,
    rate: 0.16666666666666666,
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'Cancelled',
    receiver: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  }),
];
