// useSubjects.js
import { useState, useEffect } from 'react';
// import { transformSubjectData } from './transformSubjects';
import { getTracks } from '@/services/apiService';

export default function trackGetter() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({});

  useEffect(() => {
    setIsLoading(true)
    getTracks()
      .then((data) => {
        setIsLoading(false)
        setData(data);
      })
      .catch((err) => console.error('Failed to fetch subjects', err));
  }, []);

  return { data, isLoading};
}


