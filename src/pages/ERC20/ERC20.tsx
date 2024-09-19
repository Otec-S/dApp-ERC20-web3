import { FC } from 'react';

import Header from '../../components/header/Header';
import AddToken from '../../components/popup/AddToken';

export const ERC20: FC = () => {
  return (
    <div style={{ background: '#000' }}>
      <Header />
      <AddToken callback={()=>undefined} />
    </div>
  );
};
