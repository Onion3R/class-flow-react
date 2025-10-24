// // sectionStore.js
// import { useState, useEffect } from 'react';
// import { getGeneratedSchedules } from '@/app/services/apiService';

// let refreshCallback = () => {};

// export const triggerGeneratedScheduleGetter = () => {
//   refreshCallback(); // triggers the actual refetch inside the hook
// };

// export default function useGeneratedScheduleGetter() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState([]); // 👈 Initialized as array to match expected type
//   const [refreshToken, setRefreshToken] = useState(0);
//   const [error, setError] = useState(null); // 👈 Optional: track error state

//   // Register global refresh trigger
//   useEffect(() => {
//     refreshCallback = () => setRefreshToken((prev) => prev + 1);
//     return () => {
//       refreshCallback = () => {};
//     };
//   }, []);

//   // Fetch data when component mounts or when refresh is triggered
//   useEffect(() => {
//     setIsLoading(true);
//     getGeneratedSchedules()
//       .then((apiData) => {
//         if (Array.isArray(apiData)) {
//           setData(apiData);
//           setError(null);
//         } else {
//           setData([]);
//           setError(new Error('API did not return an array'));
//           console.warn('getGeneratedSchedules did not return an array. Received:', apiData);
//         }
//       })
//       .catch((err) => {
//         console.error('Failed to fetch schedules:', err);
//         setData([]);
//         setError(err);
//       })
//       .finally(() => setIsLoading(false));
//   }, [refreshToken]);

//   return { data, isLoading, error };

// }

import { useState, useEffect, useCallback } from 'react';
import { getGeneratedSchedules } from '@/app/services/apiService';

/**
 * Custom hook to fetch and manage generated schedules.
 * Returns the data, loading state, error state, and a refresh function.
 */
const useGeneratedScheduleGetter = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized refresh function
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getGeneratedSchedules();
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setError(null);
      } else {
        console.warn('Invalid data format:', fetchedData);
        setData([]);
        setError(new Error('API did not return an array'));
      }
    } catch (err) {
      console.error('Failed to fetch generated schedules:', err);
      setData([]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useGeneratedScheduleGetter;

