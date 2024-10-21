import { createThirdwebClient } from 'thirdweb';

export const thirdWebClient = createThirdwebClient({ clientId: import.meta.env.VITE_THIRD_WEB_CLIENT_ID });
