import { getSubjects } from '@/app/services/apiService';
import { useState, useEffect, useCallback } from 'react';

const useSubjectsGetter = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedData = await getSubjects();
      if (!fetchedData || (Array.isArray(fetchedData) && fetchedData.length === 0)) {
        setData([]);
      } else {
        setData(fetchedData);
      }
    } catch (err) {
      console.error('Failed to fetch teachers data:', err);
      setError(err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useSubjectsGetter;
