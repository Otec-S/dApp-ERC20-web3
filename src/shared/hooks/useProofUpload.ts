import { useEffect, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { upload } from 'thirdweb/storage';

import { Proofs } from '@shared/constants/nftContract';

export const useProofUpload = (proofs: Proofs) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_THIRD_WEB_CLIENT_ID;
  console.log('inside hook' + clientId)
  const client = createThirdwebClient({ clientId });
  useEffect(() => {
    const file = new File([JSON.stringify(proofs)], '1.json');
    const uploadData = async () => {
      setLoading(true);
      try {
        const uri = await upload({
          client,
          files: [file],
        });
        setUri(uri);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    uploadData();
    return () => {};
  }, [client, proofs]);
  return { uri, loading, error };
};
