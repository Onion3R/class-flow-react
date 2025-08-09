// semesterStore.js
import { getSemester } from '@/services/apiService';
import { useState, useEffect } from 'react';

let refreshSemesterCallback = () => {};

export const triggerRefreshSemester = () => {
  refreshSemesterCallback(); // triggers the actual refetch inside the hook
};

export default function useSemesterGetter() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // Setup the global refresh trigger
  useEffect(() => {
    refreshSemesterCallback = () => setRefreshToken((prev) => prev + 1);
    return () => {
      refreshSemesterCallback = () => {};
    };
  }, []);

  // Refetch when refreshToken changes
  useEffect(() => {
    setIsLoading(true);
    getSemester()
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          setData(apiData);
        } else {
          console.warn('getSemester did not return an array:', apiData);
          setData([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch semesters:', err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [refreshToken]);

  return {
    data,
    isLoading,
  };
}
