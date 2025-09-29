import { useState, useEffect } from "react";
import useTeacherWorkloadGetter from "@/lib/hooks/useTeacherWorkload";

function useTransformedTeacherData() {
  const {
    data: rawData,
    isLoading: teacherWorkloadIsLoading,
    error,
  } = useTeacherWorkloadGetter();

  const [transformedData, setTransformedData] = useState({});


  useEffect(() => {
    if (teacherWorkloadIsLoading || !rawData) {
      if (!teacherWorkloadIsLoading && !rawData) {
        setTransformedData([]);
      }
      return;
    }

    const extractedData = rawData.map(entry => {
    const {
      generated_schedule, 
      teacher_name,
      subjects_assigned,
      sections_taught,
      utilization_percentage,
      total_minutes_assigned,
      max_minutes_allowed,
    } = entry;

    // Remove duplicates using Set
    const uniqueSubjects = entry.subjects_assigned.map(e =>   e.code);
    const uniqueSections = entry.sections_taught.map(e =>   e.name)

    return {
      id: generated_schedule?.id,
      name: teacher_name,
      subjects_assigned: uniqueSubjects,
      sections_taught: uniqueSections,
      utilization_percentage,
      total_minutes_assigned,
      max_minutes_allowed,
    };
  });



    setTransformedData(extractedData);
    // console.log("Transformed Data:", extractedData);
  }, [rawData, teacherWorkloadIsLoading]);

  return {
    transformedData,
    isLoading: teacherWorkloadIsLoading,
    error,
  };
}

export default useTransformedTeacherData;
