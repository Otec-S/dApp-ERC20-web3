import { useEffect, useState } from 'react';
import { download } from 'thirdweb/storage';

import { Proofs } from '@shared/constants/nftContract';

import {thirdWebClient} from '../../../thirdWebClient';

export const useProofDownload = (uri: string | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState<Proofs | null>(null);
  useEffect(() => {
    const downloadData = async () => {
      setLoading(true);
      try {
        if (uri) {
          const file: Response = await download({
            client:thirdWebClient,
            uri,
          });
          const proofs = await file.json();
          setFile(proofs);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    downloadData();
    return () => {};
  }, [uri]);
  return { file, loading, error };
};
