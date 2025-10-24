import { getStrands } from '@/app/services/apiService';
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to fetch and manage strands data.
 * It returns the data, a loading state, and a refresh function.
 */
const useStrandGetter = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // The refresh function is memoized with useCallback.
  // This ensures the function reference doesn't change on every render.
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call your actual data fetching function for strands
      const fetchedData = await getStrands();
      // Ensure the fetched data is an array
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
      } else {
        console.warn('Invalid data format:', fetchedData);
        setData([]);
      }
    } catch (error) {
      console.error('Failed to fetch strands data:', error);
      // Set data to an empty array on error to prevent issues
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // The empty dependency array means this function is created only once.

  // Use useEffect to trigger the initial data fetch when the component mounts.
  // Since 'refresh' is memoized, this effect will only run once on mount.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, refresh };
};

export default useStrandGetter;
