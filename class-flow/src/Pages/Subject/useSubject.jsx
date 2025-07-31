// useSubjects.js
import { useState, useEffect } from 'react';
// import { transformSubjectData } from './transformSubjects';
import { getSubjectStrand } from '@/services/apiService';

export default function subjectGetter() {
  const [isLoading, setIsLoading] = useState(false)
  const [groupedSubjects, setGroupedSubjects] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    setIsLoading(true)
    getSubjectStrand()
      .then((data) => {
        setIsLoading(false)
        setData(data);
        // setGroupedSubjects(transformSubjectData(data));
      })
      .catch((err) => console.error('Failed to fetch subjects', err));
  }, []);

  return { data, groupedSubjects, isLoading};
}


