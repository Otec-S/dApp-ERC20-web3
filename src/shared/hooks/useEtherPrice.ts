import { useEffect, useState } from 'react';

const url = 'https://api.arbiscan.io/api?module=stats&action=ethprice&apikey=ZVWQX3UJZVZDK9STWWMBVE6ETZQ42TTH7C';

export const useEtherPrice = () => {
  const [ethusd, setEthusd] = useState(0);

  useEffect(() => {
    new Promise((resolve) => {
      fetch(url).then((response) => resolve(response.json()));
    }).then((res) => {
      setEthusd(res.result.ethusd);
    });
  }, []);

  return { ethusd };
};
