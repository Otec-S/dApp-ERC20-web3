import { useEffect, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { download } from 'thirdweb/storage';

export interface NFTFile {
  image: string;
}

export const useFetchFiles = () => {
  const client = createThirdwebClient({ clientId: '0c0dcc5c52fbee7dd63b7534a5bbcc77' });
  const uri = 'https://ipfs.io/ipfs/QmNe7EebKaNuRoN2ov9nMuwHXQvXbYXCLM9W1nDBxnqLgL/';

  const [files, setFiles] = useState<NFTFile[]>([]);

  const fetches: Promise<NFTFile>[] = Array.from(Array(10).keys()).map((id) => {
    return new Promise((resolve) => {
      download({
        client,
        uri: `${uri}${id + 1}.json`,
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
