import { useEffect, useState } from 'react';
import { upload } from 'thirdweb/storage';

import { Proofs } from '@shared/constants/nftContract';

import { thirdWebClient } from '../../../thirdWebClient';

export const useProofUpload = (proofs?: Proofs) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    if (proofs) {
      const file = new File([JSON.stringify(proofs)], '1.json');
      const uploadData = async () => {
        setLoading(true);
        try {
          const uri = await upload({
            client: thirdWebClient,
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
    }
    return () => {};
  }, [proofs]);
  return { uri, loading, error };
};
