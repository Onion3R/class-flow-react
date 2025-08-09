// strandStore.js
import { getStrands } from '@/services/apiService';
import { useState, useEffect } from 'react';

let refreshCallback = () => {};

export const triggerStrandRefresh = () => {
  refreshCallback(); // triggers the actual refetch inside the hook
};

// Custom hook
export default function useStrandGetter() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // Expose how to trigger refresh globally
  useEffect(() => {
    refreshCallback = () => setRefreshToken((prev) => prev + 1);
    return () => {
      // Cleanup to avoid memory leaks
      refreshCallback = () => {};
    };
  }, []);

  // Fetch data whenever refreshToken changes
  useEffect(() => {
    setIsLoading(true);
    getStrands()
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          setData(apiData);
        } else {
          console.warn('Invalid data format:', apiData);
          setData([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch strands:', err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [refreshToken]);

  return {
    data,
    isLoading,
  };
}
