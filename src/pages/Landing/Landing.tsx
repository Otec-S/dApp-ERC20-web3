import { FC } from 'react';

import AddToken from '../../components/popup/AddToken';

const Landing: FC = () => {
  const handleClose = () => undefined;
  return <AddToken handleClose={handleClose} />;
};

export default Landing;
