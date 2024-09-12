import React from 'react';
import classes from './Landing.module.css';
import { landing, sendErc, tradeErc, collection } from '../../assets/images';

export const Landing: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.imageSection}>
        <img src={landing.default} className={classes.image} />
        <div className={classes.title}>
          <h1>Web3 platform for everything in crypto</h1>
        </div>
        <div>
          <button className={classes.button}>Start using now</button>
        </div>
      </div>
      <div className={classes.section}>
        <h2>Products</h2>
        <div className={classes.sendBlock}>
          <div className={classes.blockTextGroup}>
            <h3>Send ERC-20</h3>
            <p>Send ERC-20 tokens quickly and without fees!</p>
            <p>
              Our product allows you to transfer any amount of tokens directly, without intermediaries or extra costs.
              Simply select the recipient, specify the amount, and your transaction is instantly completed. Convenient
              and secure asset management without limitations!
            </p>
            <button className={classes.blockButton}>Go to app</button>
          </div>
          <div className={classes.blockImgWrap}>
            <a href="/">
              <img src={sendErc.default} className={classes.blockImg} />
            </a>
          </div>
        </div>
        <div className={classes.tradeBlock}>
          <div className={classes.blockTextGroup}>
            <h3>Trade ERC-20</h3>
            <p>Token exchange made simple and secure!</p>
            <p>
              Create and accept token exchange offers with other users. Specify which tokens you want to give and
              receive, and choose the recipient. Tokens are stored in a smart contract until the transaction is
              complete. Trade tokens with minimal fees and full transparency!
            </p>
            <button className={classes.blockButton}>Go to app</button>
          </div>
          <div className={classes.blockImgWrap}>
            <a href="/">
              <img src={tradeErc.default} className={classes.blockImg} />
            </a>
          </div>
        </div>
        <div className={classes.collectionBlock}>
          <div className={classes.blockTextGroup}>
            <h3>NFT Collection</h3>
            <p>Unlock unique opportunities with our NFT</p>
            <p>
              Each token is a unique piece of digital art and your access to exclusive company products and services.
              Join our community of collectors and gain privileges available only to our NFT holders. Invest in the
              future and enjoy exclusive benefits!
            </p>
            <button className={classes.blockButton}>Go to app</button>
          </div>
          <div className={classes.blockImgWrap}>
            <a href="/">
              <img src={collection.default} className={classes.blockImg} />
            </a>
          </div>
        </div>
      </div>
      <div className={classes.section}>
        <h2>Statistics</h2>
        <div className={classes.statisticBlock}>
          <div className={classes.statisticItem}>
            <p className={classes.statisticText}>Over 200,000</p>
            <p className={classes.statisticDescription}>Clients from different countries</p>
          </div>
          <div className={classes.statisticItem}>
            <p className={classes.statisticText}>Over 22,000</p>
            <p className={classes.statisticDescription}>Orders per week</p>
          </div>
          <div className={classes.statisticItem}>
            <p className={classes.statisticText}>Over 200</p>
            <p className={classes.statisticDescription}>DeFi projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};
