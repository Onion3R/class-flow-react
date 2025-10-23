import api from "@/lib/api";


export const getTeacherDashboardInfo = async (id, scheduleId) => {
  const response = await api.get(`teachers/${id}/schedule_dashboard/?generated_schedule_id=${scheduleId}`);
  return response.data;
};
export const getTeacherSchedule = async (id, filters, scheduleId) => {
  const response = await api.get(`teachers/${id}/weekly_timetable/?generated_schedule_id=${scheduleId}${filters}`);
  return response.data;
};
export const getTeacherTimetableFilterOptions = async (id) => {
  const response = await api.get(`teachers/${id}/filter_options/`);
  return response.data;
};
export const getProfile = async (id) => {
  const response = await api.get(`teachers/${id}/profile/?include_specializations=true&include_completion_analysis=true`);
  return response.data;
};
export const getAnalytics = async (id, scheduleId) => {
  const response = await api.get(`teachers/${id}/teaching_load_analytics/?generated_schedule_id=${scheduleId}&detail_level=detailed`);
  return response.data;
};
export const getWeeklyTimetable = async (id, scheduleId) => {
  const response = await api.get(`teachers/${id}/teaching_load_analytics/?generated_schedule_id=${scheduleId}&detail_level=detailed`);
  return response.data;
};





// GET /api/teachers/1/weekly_timetable/?generated_schedule_id=5&view_format=grid&include_breaks=true&highlight_conflicts=true