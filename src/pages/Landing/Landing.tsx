import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, landing, sendErc, tradeErc } from '../../assets/images';
import classes from './Landing.module.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const blockData = [
    {
      title: 'Send ERC-20',
      description: 'Send ERC-20 tokens quickly and without fees!',
      text: 'Our product allows you to transfer any amount of tokens directly, without intermediaries or extra costs. Simply select the recipient, specify the amount, and your transaction is instantly completed. Convenient and secure asset management without limitations!',
      link: '/',
      classname: classes.sendBlock,
      imageSrc: sendErc.default,
    },
    {
      title: 'Trade ERC-20',
      description: 'Token exchange made simple and secure!',
      text: 'Create and accept token exchange offers with other users. Specify which tokens you want to give and receive, and choose the recipient. Tokens are stored in a smart contract until the transaction is complete. Trade tokens with minimal fees and full transparency!',
      link: '/',
      classname: classes.tradeBlock,
      imageSrc: tradeErc.default,
    },
    {
      title: 'NFT Collection',
      description: 'Unlock unique opportunities with our NFT collection!',
      text: 'Each token is a unique piece of digital art and your access to exclusive company products and services. Join our community of collectors and gain privileges available only to our NFT holders. Invest in the future and enjoy exclusive benefits!',
      link: '/',
      classname: classes.collectionBlock,
      imageSrc: collection.default,
    },
  ];

  const statisticData = [
    { text: 'Over 200,000', description: 'Clients from different countries' },
    { text: 'Over 22,000', description: 'Orders per week' },
    { text: 'Over 200', description: 'DeFi projects' },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.imageSection}>
        <img src={landing.default} className={classes.mainImage} alt={'main image'} />
        <div className={classes.title}>
          <h1 className={classes.titleText}>Web3 platform for everything in crypto</h1>
        </div>
        <button className={classes.button}>Start using now</button>
      </div>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Products</h2>
        {blockData.map((item) => (
          <div className={item.classname}>
            <div className={classes.blockTextGroup}>
              <h3 className={classes.blockTitle}>{item.title}</h3>
              <p className={classes.text}>{item.description}</p>
              <p className={classes.text}>{item.text}</p>
              <button className={classes.blockButton} onClick={() => navigate(item.link)}>
                Go to app
              </button>
            </div>
            <div className={classes.blockImgWrap}>
              <Link to={item.link}>
                <img src={item.imageSrc} className={classes.blockImg} alt={item.title} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Statistics</h2>
        <div className={classes.statisticBlock}>
          {statisticData.map((item) => (
            <div className={classes.statisticItem}>
              <p className={classes.statisticText}>{item.text}</p>
              <p className={classes.statisticDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
