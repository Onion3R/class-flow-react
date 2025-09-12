// import { getTeachers } from '@/app/services/apiService';
import { getTeachers } from '@/app/services/teacherService';
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to fetch and manage teachers data.
 * It returns the data, a loading state, an error state, and a refresh function.
 */
const useTeachersGetter = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling

  // The refresh function is memoized with useCallback.
  // This ensures the function reference doesn't change on every render.
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset the error state before a new fetch

    try {
      // Call your actual data fetching function for teachers
      const fetchedData = await getTeachers();

      // Check for empty or invalid data
      if (!fetchedData || (Array.isArray(fetchedData) && fetchedData.length === 0)) {
        setData([]); // Still a successful fetch, but no data
      } else {
        setData(fetchedData);
      }
    } catch (err) {
      console.error('Failed to fetch teachers data:', err);
      setError(err); // Capture the error object
      setData([]); // Set data to an empty array on error as a fallback
    } finally {
      setIsLoading(false);
    }
  }, []); // The empty dependency array means this function is created only once.

  // Use useEffect to trigger the initial data fetch when the component mounts.
  // Since 'refresh' is memoized, this effect will only run once on mount.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useTeachersGetter;
