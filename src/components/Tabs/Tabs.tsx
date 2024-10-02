import { FC } from 'react';
import { Link } from 'react-router-dom';

import { tabs } from './Tabs.constants';
import styles from './Tabs.module.css';

export const Tabs: FC = () => {
  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <Link to={tab.route} relative="path" className={styles.tabLink}>
          <div className={styles.tab}>
            {tab.icon}
            <p className={styles.tabName}>{tab.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
