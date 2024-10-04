import { Address } from 'viem';

import { NotFoundIcon } from '@assets/icons';
import { tokens } from '@shared/constants';

const getTokenIcon = (address: Address) => {
  const tokenInSupportedTokens = tokens.find(
    (token) => token.polygonAddress === address || token.sepoliaAddress === address,
  );
  if (tokenInSupportedTokens) return tokenInSupportedTokens.icon;
  return <NotFoundIcon />;
};

export default getTokenIcon;
