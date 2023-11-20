import { FC, useEffect, useState } from 'react';
import './App.css';
import SquareDisplay from './components/SquareDisplay/SquareDisplay';
import { Square } from './interfaces/Square';

const App: FC = () => {
  const [data, setData] = useState<Square[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>('');

  useEffect(() => {
    const baseUrl = 'https://60816d9073292b0017cdd833.mockapi.io/modes';

    const getSquareData = async () => {
      try {
        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(`Error when get data: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    getSquareData();
  }, []);

  return (
    <>
      {loading ? (
        <p className='text-center my-5'>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <SquareDisplay data={data} />
      )}
    </>
  );
};

export default App;
