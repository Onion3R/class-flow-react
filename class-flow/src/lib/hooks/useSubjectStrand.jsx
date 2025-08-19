// useSubjectStrandGetter.js

import { useState, useEffect, useCallback } from 'react';
import { getSubjectStrand } from '@/services/apiService';

/**
 * Custom hook to fetch and manage subject strand data.
 * The refresh functionality is now encapsulated within the hook.
 *
 * @returns {{
 * data: Array,
 * isLoading: boolean,
 * refresh: Function
 * }} An object containing the data, loading state, and a refresh function.
 */
export default function useSubjectStrandGetter() {
  // State for the fetched data, loading status, and a token to trigger refresh
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // Memoized function to trigger a data refresh.
  // We use useCallback to ensure this function reference is stable
  // and doesn't cause unnecessary re-renders in components that use it.
  const refresh = useCallback(() => {
    setRefreshToken(prev => prev + 1);
  }, []);

  // Effect to fetch data whenever the refreshToken changes
  useEffect(() => {
    // We only want to fetch if the component is still mounted.
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const apiData = await getSubjectStrand();
        if (isMounted) {
          if (Array.isArray(apiData)) {
            setData(apiData);
          } else {
            console.warn('Invalid data format:', apiData);
            setData([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch strands:', err);
          setData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  // Return the data, loading state, and the refresh function
  return {
    data,
    isLoading,
    refresh,
  };
}
