// subjectStore.js
import { useState, useEffect } from 'react';
import { getSubjectStrand } from '@/services/apiService';

let refreshCallback = () => {};

export const triggerSubjectStrandRefresh = () => {
  refreshCallback(); // triggers the actual refetch inside the hook
};

export default function subjectStrandGetter() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshToken, setRefreshToken] = useState(0);

  // Register the callback globally
  useEffect(() => {
    refreshCallback = () => setRefreshToken((prev) => prev + 1);
    return () => {
      refreshCallback = () => {};
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getSubjectStrand()
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          setData(apiData);
        } else {
          setData([]);
          console.warn('getSubjectStrand did not return an array. Received:', apiData);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch subject strands:', err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [refreshToken]);

  return { data, isLoading };
}
