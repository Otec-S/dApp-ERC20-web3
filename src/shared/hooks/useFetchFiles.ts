import { useEffect, useState } from 'react';
import { download } from 'thirdweb/storage';

import { thirdWebClient } from '../../../thirdWebClient';

export interface NFTFile {
  image: string;
  name: string;
}

const uri = 'https://ipfs.io/ipfs/QmNe7EebKaNuRoN2ov9nMuwHXQvXbYXCLM9W1nDBxnqLgL/';

export const useFetchFiles = () => {
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const [files, setFiles] = useState<NFTFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetches: Promise<NFTFile>[] = tokenIds.map((id) => {
      return new Promise((resolve) => {
        download({
          client: thirdWebClient,
          uri: `${uri}${id}.json`,
        }).then((file) => {
          resolve(file.json());
        });
      });
    });

    Promise.all(fetches)
      .then((res) => {
        const formatData = res.map((item) => {
          const imageArr = item.image.split('/');
          return {
            image: `https://ipfs.io/ipfs/${imageArr[2]}/${imageArr[3]}`,
            name: item.name,
          };
        });
        setFiles(formatData);
      })
      .then(() => setLoading(false));
  }, [tokenIds]);

  return { files, setTokenIds, loading };
};
