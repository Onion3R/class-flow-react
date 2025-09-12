import { getYearLevels } from '@/app/services/apiService';
import { useState, useEffect } from 'react';

export default function useYearLevelsGetter() {
  const [isLoading, setIsLoading] = useState(false);
  // Initialize 'data' as an empty array to ensure .map() always works
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getYearLevels()
      .then((apiData) => { // Renamed parameter to avoid confusion with state 'data'
        setIsLoading(false);
        if (Array.isArray(apiData)) {
          setData(apiData); // Set state if it's an array
        } else {
          setData([]); // Otherwise, set an empty array to prevent errors
          console.warn('getSemester did not return an array. Received:', apiData);
        }
      })
      .catch((err) => {
        setIsLoading(false); // Make sure loading state is reset on error
        setData([]); // Clear data or set to empty array on error
        console.error('Failed to fetch subjects:', err);
      });
  }, []); // Empty dependency array means this runs once on mount

  return { data, isLoading };
}