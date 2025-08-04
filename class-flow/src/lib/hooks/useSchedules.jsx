// useSchedule.js
import { useState, useEffect } from 'react';
import { getSchedules } from '@/services/apiService';

let refreshCallback = () => {};

export const triggerScheduleRefresh = () => {
  refreshCallback(); // triggers the actual refetch inside the hook
};

export default function useSchedule() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    refreshCallback = () => setRefreshToken((prev) => prev + 1);
    return () => {
      refreshCallback = () => {};
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getSchedules()
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          setData(apiData);
        } else {
          setData([]);
          console.warn('getSchedules did not return an array. Received:', apiData);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch schedules:', err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [refreshToken]);

  return { data, isLoading };
}
