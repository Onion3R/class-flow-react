import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/authContext';
import { getProfile, getAnalytics, getTeacherDashboardInfo, getTeacherTimetableFilterOptions } from '../service/teacherService';
const useProfileInfoGetter = (scheduleId) => {
  const { teacherData } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!teacherData?.id) return;
    setIsLoading(true);
    setError(null);

    try {
       console.log('teacherData',teacherData)
      const [profile, analytics, timeTableFilters,  teacherDashboardInfo] = await Promise.all([
        getProfile(teacherData.id),
        getAnalytics(teacherData.id, scheduleId),
        getTeacherTimetableFilterOptions(teacherData.id),
        getTeacherDashboardInfo(teacherData.id, scheduleId),
      ]);
      const id = teacherData.id

      setData({ profile, analytics, timeTableFilters, teacherDashboardInfo, id  });
    } catch (err) {
      console.error('Failed to fetch teachers data:', err);
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [teacherData?.id, scheduleId]);

 useEffect(() => {
  if (teacherData?.id && scheduleId) {
    refresh();
  }
}, [teacherData?.id, scheduleId, refresh]);

  return { data, isLoading, teacherData ,error, refresh };
};

export default useProfileInfoGetter;
