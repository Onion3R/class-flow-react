// sectionStore.js
import { useState, useEffect } from 'react';
import { getSections } from '@/services/apiService';

let refreshCallback = () => {};

export const triggerSectionRefresh = () => {
  refreshCallback(); // triggers the actual refetch inside the hook
};

export default function useSectionGetter() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [refreshToken, setRefreshToken] = useState(0);

  // Register global refresh trigger
  useEffect(() => {
    refreshCallback = () => setRefreshToken((prev) => prev + 1);
    return () => {
      refreshCallback = () => {};
    };
  }, []);

  // Fetch data when component mounts or when refresh is triggered
  useEffect(() => {
    setIsLoading(true);
    getSections()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => {
        console.error('Failed to fetch sections:', err);
        setData({});
      })
      .finally(() => setIsLoading(false));
  }, [refreshToken]);

  return { data, isLoading };
}
