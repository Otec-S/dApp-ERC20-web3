import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';

import { tabs } from './Tabs.constants';
import styles from './Tabs.module.css';

export const Tabs: FC = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <NavLink
          to={tab.route}
          relative="path"
          className={cn(styles.tabLink, { [styles.tabLinkActive]: pathname.includes(tab.route) })}
        >
          {tab.icon}
          <p className={styles.tabName}>{tab.name}</p>
        </NavLink>
      ))}
    </div>
  );
};
