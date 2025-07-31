// useSubjects.js
import { useState, useEffect } from 'react';
// import { transformSubjectData } from './transformSubjects';
import { getStrands } from '@/services/apiService';

export default function strandGetter() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({});

  useEffect(() => {
    setIsLoading(true)
    getStrands()
      .then((data) => {
        setIsLoading(false)
        setData(data);      })
      .catch((err) => console.error('Failed to fetch subjects', err));
  }, []);

  return { data, isLoading};
}


