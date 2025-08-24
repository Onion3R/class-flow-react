// useSchedule.js
import { useState, useEffect, useCallback } from 'react';
import { getSchedules } from '@/services/apiService';

/**
 * Custom hook to fetch and manage schedules data.
 * It returns the data, a loading state, and a refresh function.
 */
const useScheduleGetter = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized refresh function (same pattern as useStrandGetter)
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getSchedules();
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
      } else {
        console.warn('Invalid data format:', fetchedData);
        setData([]);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, refresh };
};

export default useScheduleGetter;
