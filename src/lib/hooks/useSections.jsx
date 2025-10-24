import { useState, useEffect, useCallback } from 'react';
import { getSections } from '@/app/services/apiService';

/**
 * Custom hook to fetch and manage sections data.
 * It returns the data, a loading state, and a refresh function.
 */
const useSectionGetter = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // The refresh function is memoized with useCallback. This ensures
  // the function reference doesn't change on every render, which is
  // crucial for the useEffect dependency array.
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call the API service to fetch the section data
      const fetchedData = await getSections();
      setData(fetchedData);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      // Set data to an empty object on error
      setData({});
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

export default useSectionGetter;
