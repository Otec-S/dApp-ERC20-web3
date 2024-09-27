import { Address } from "viem";

import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';
import { tokens } from "@src/shared/constants";

const getTokenIcon = (address: Address) => {
  const tokenInSupportedTokens = tokens.find(
    (token) => token.polygonAddress === address || token.sepoliaAddress === address,
  );
  if (tokenInSupportedTokens) return tokenInSupportedTokens.icon;
  return <NotFoundTokenLogo/>;
};

export default getTokenIcon;