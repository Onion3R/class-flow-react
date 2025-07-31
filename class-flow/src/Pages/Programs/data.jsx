// src/hooks/useProgramsData.jsx (or src/utils/useProgramsData.jsx)
import { useState, useEffect } from 'react';
import { getStrands } from "@/services/apiService"; // Assuming this path is correct

function useProgramsData() {
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [data, setData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const result = await getStrands();
        // Assuming getStrands returns the array directly
        setData(result);
      } catch (err) {
        console.error('Failed to fetch programs data', err);
        setData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array means this runs once on mount

  return { data, isLoading };
}

export default useProgramsData;