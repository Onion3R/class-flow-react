import {  getOperationalSection, getOperationalSubjects, getOperationalTeachers, getOperationalStrands} from "@/app/services/operationalDataService"
import { useState, useEffect, useCallback } from 'react';

const useOperationalDataGetter = (id) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const teachers = await getOperationalTeachers(id);
      const sections = await getOperationalSection(id);
      const subjects = await getOperationalSubjects(id);
      const strands = await getOperationalStrands(id);

      setData({ teachers, sections, subjects, strands});
    } catch (err) {
      console.error('Failed to fetch operational data:', err);
      setError(err);
      setData({});
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
};

export default useOperationalDataGetter;
