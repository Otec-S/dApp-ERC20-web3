import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { landing, tokenBlockImage } from '@src/assets/images';
import Header from '@src/components/header/Header';
import { TokensBlock } from '@src/components/TokensBlock';
import { blockData, statisticData } from './Landing.constants';
import classes from './Landing.module.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
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
          <div className={item.classname} key={item.title}>
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
            <div className={classes.statisticItem} key={item.text}>
              <p className={classes.statisticText}>{item.text}</p>
              <p className={classes.statisticDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Supported ERC-20 tokens</h2>
        <div className={classes.tokenBlock}>
          <div className={classes.tokenGroup}>
            <TokensBlock />
            <div className={classes.tokenDescription}>Or any other ERC-20 token of yours</div>
          </div>
          <div className={classes.tokenImageWrap}>
            <img src={tokenBlockImage.default} className={classes.tokenBlockImage} alt={'Supported ERC-20 tokens'} />
          </div>
        </div>
      </div>
    </div>
  );
};
