import { collection, sendErc, tradeErc } from '@assets/images';
import { ROUTS } from '@src/shared/constants';

import classes from './Landing.module.css';

export const blockData = [
  {
    title: 'Send ERC-20',
    description: 'Send ERC-20 tokens quickly and without fees!',
    text: 'Our product allows you to transfer any amount of tokens directly, without intermediaries or extra costs. Simply select the recipient, specify the amount, and your transaction is instantly completed. Convenient and secure asset management without limitations!',
    link: ROUTS.SEND_ERC20,
    classname: classes.sendBlock,
    imageSrc: sendErc.default,
  },
  {
    title: 'Trade ERC-20',
    description: 'Token exchange made simple and secure!',
    text: 'Create and accept token exchange offers with other users. Specify which tokens you want to give and receive, and choose the recipient. Tokens are stored in a smart contract until the transaction is complete. Trade tokens with minimal fees and full transparency!',
    link: ROUTS.HOME,
    classname: classes.tradeBlock,
    imageSrc: tradeErc.default,
  },
  {
    title: 'NFT Collection',
    description: 'Unlock unique opportunities with our NFT collection!',
    text: 'Each token is a unique piece of digital art and your access to exclusive company products and services. Join our community of collectors and gain privileges available only to our NFT holders. Invest in the future and enjoy exclusive benefits!',
    link: ROUTS.HOME,
    classname: classes.collectionBlock,
    imageSrc: collection.default,
  },
];

export const statisticData = [
  { text: 'Over 200,000', description: 'Clients from different countries' },
  { text: 'Over 22,000', description: 'Orders per week' },
  { text: 'Over 200', description: 'DeFi projects' },
];
