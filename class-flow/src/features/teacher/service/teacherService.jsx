import api from "@/lib/api";

const TEACHER_ID = 23
const SELECTED_SCHEDULE = 384
export const getTeacherDashboardInfo = async (id) => {
  const response = await api.get(`teachers/${id}/schedule_dashboard/?generated_schedule_id=${SELECTED_SCHEDULE}`);
  return response.data;
};
export const getTeacherSchedule = async (id, filters) => {
  const response = await api.get(`teachers/${id}/weekly_timetable/?generated_schedule_id=${SELECTED_SCHEDULE}${filters}`);
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
export const getAnalytics = async (id) => {
  const response = await api.get(`teachers/${id}/teaching_load_analytics/?generated_schedule_id=${SELECTED_SCHEDULE}&detail_level=detailed`);
  return response.data;
};





// GET /api/teachers/1/weekly_timetable/?generated_schedule_id=5&view_format=grid&include_breaks=true&highlight_conflicts=true