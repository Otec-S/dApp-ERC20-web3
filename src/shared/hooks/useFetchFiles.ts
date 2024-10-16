import { useEffect, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { download } from 'thirdweb/storage';

export interface NFTFile {
  image: string;
}

const uri = 'https://ipfs.io/ipfs/QmNe7EebKaNuRoN2ov9nMuwHXQvXbYXCLM9W1nDBxnqLgL/';

export const useFetchFiles = ({ tokenIds }: { tokenIds: number[] }) => {
  const clientId = import.meta.env.VITE_THIRD_WEB_CLIENT_ID ?? '';
  const client = createThirdwebClient({ clientId });

  const [files, setFiles] = useState<NFTFile[]>([]);

  const fetches: Promise<NFTFile>[] = tokenIds.map((id) => {
    return new Promise((resolve) => {
      download({
        client,
        uri: `${uri}${id}.json`,
      }).then((file) => {
        resolve(file.json());
      });
    });
  });

  useEffect(() => {
    Promise.all(fetches).then((res) => {
      const formatData = res.map((item) => {
        const imageArr = item.image.split('/');
        return {
          image: `https://ipfs.io/ipfs/${imageArr[2]}/${imageArr[3]}`,
        };
      });
      setFiles(formatData);
    });
  }, []);

  return { files };
};
