import { getGenerationHistory } from '@/app/services/generateService';
import { useState, useEffect, useCallback } from 'react';


const useGenerationHistoryGetter = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // <-- NEW

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error before fetching

    try {
      const fetchedData = await getGenerationHistory();

      // Check if data is empty
      if (!fetchedData || (Array.isArray(fetchedData) && fetchedData.length === 0)) {
        setData([]); // Still a successful fetch, just no data
      } else {
        console.log('fetched data', fetchedData)
        setData(fetchedData);
      }
    } catch (err) {
      console.error('Failed to fetch history data:', err);
      setError(err); // <-- Capture the error
      setData([]);   // Optional: fallback to empty array
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useGenerationHistoryGetter;
