import { useEffect, useState } from 'react';
import { getSubjects } from '@/services/apiService';

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSubjects()
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { subjects, loading, error };
}
