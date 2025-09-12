import { useState, useEffect, useCallback } from 'react';
import { getSubjects } from '@/app/services/apiService';

let refreshCallback = () => {};

export const triggerSubjectsRefresh = () => {
  refreshCallback();
};

export default function useSubjectsGetter() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => setRefreshToken((prev) => prev + 1), []);

  useEffect(() => {
    refreshCallback = refresh;
    return () => {
      refreshCallback = () => {};
    };
  }, [refresh]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getSubjects()
      .then((apiData) => {
        if (isMounted) {
          setData(Array.isArray(apiData) ? apiData : []);
          if (!Array.isArray(apiData)) {
            console.warn('getSubjects did not return an array. Received:', apiData);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setData([]);
          console.error('Failed to fetch subjects:', err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  return { data, isLoading };
}
