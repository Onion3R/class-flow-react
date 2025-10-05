import api from "@/lib/api";

export const getTeacherInfo = async () => {
  const response = await api.get('teachers/11/schedule_dashboard/?generated_schedule_id=372');
  return response.data;
};
export const getTeacherSchedule = async () => {
  const response = await api.get('teachers/11/weekly_timetable/?generated_schedule_id=372&view_format=grid&include_breaks=true&highlight_conflicts=true');
  return response.data;
};



// GET /api/teachers/1/weekly_timetable/?generated_schedule_id=5&view_format=grid&include_breaks=true&highlight_conflicts=true