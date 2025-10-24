import { getTimetableData } from '@/app/services/timetableService';
import { useState, useEffect, useCallback } from 'react';

const useDashboardDataGetter = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    // ⬇️ PLACE THIS CHECK AT THE VERY TOP
    if (!id) {
      setIsLoading(false); // stop loading immediately
      setData(null);       // clear any previous data
      return;              // exit early — no fetch call
    }

    // ✅ normal fetch process starts here
    setIsLoading(true);
    setError(null);

    try {
      const fetchedData = await getTimetableData(id);
      if (!fetchedData || (Array.isArray(fetchedData) && fetchedData.length === 0)) {
        setData([]);
      } else {
        setData(fetchedData);
      }
    } catch (err) {
      console.error('Failed to fetch timetable data:', err);
      setError(err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [id]); // ✅ re-runs whenever the id changes

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useDashboardDataGetter;
