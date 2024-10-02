import { FC } from 'react';
import { Link } from 'react-router-dom';

import { landing, tokenBlockImage } from '@assets/images';
import Header from '@components/header/Header';
import { TokensBlock } from '@components/TokensBlock/TokensBlock';
import { ROUTES } from '@shared/constants';

import { blockData, statisticData } from './Landing.constants';
import classes from './Landing.module.css';

export const Landing: FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      <div className={classes.imageSection}>
        <img src={landing} className={classes.mainImage} alt={'main image'} />
        <div className={classes.title}>
          <h1 className={classes.titleText}>Web3 platform for everything in crypto</h1>
        </div>
        <Link className={classes.button} to={ROUTES.SEND_ERC20}>
          Start using now
        </Link>
      </div>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Products</h2>
        {blockData.map((item) => (
          <div className={item.classname} key={item.title}>
            <div className={classes.blockTextGroup}>
              <h3 className={classes.blockTitle}>{item.title}</h3>
              <p className={classes.text}>{item.description}</p>
              <p className={classes.text}>{item.text}</p>
              <Link to={routes.erc20send} className={classes.blockButton}>
                Go to app
              </Link>
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
            <img src={tokenBlockImage} className={classes.tokenBlockImage} alt={'Supported ERC-20 tokens'} />
          </div>
        </div>
      </div>
    </div>
  );
};
