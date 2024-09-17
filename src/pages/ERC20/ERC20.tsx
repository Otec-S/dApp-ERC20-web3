import { FC } from 'react';
import Header from '../../components/header/Header';
import AddToken, { ITokenInfo } from '../../components/popup/AddToken';

export const ERC20: FC = () => {
  const handleClose = (data: ITokenInfo) => console.log(data);
  return (
    <div style={{ background: '#000' }}>
      <Header />
      <AddToken handleClose={handleClose} />
    </div>
  );
};
