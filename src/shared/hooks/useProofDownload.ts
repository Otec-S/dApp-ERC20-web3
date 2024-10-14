import { useEffect, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { download } from 'thirdweb/storage';

import { Proofs } from '@shared/constants/nftContract';

export const useProofDownload = (uri: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState<Proofs | null>(null);
  const clientId = import.meta.env.VITE_THIRD_WEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId });
  useEffect(() => {
    const downloadData = async () => {
      setLoading(true);
      try {
        const file: Response = await download({
          client,
          uri,
        });
        const proofs = await file.json();
        setFile(proofs);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    downloadData();
    return () => {};
  }, [client, uri]);
  return { file, loading, error };
};
