import api from "@/lib/api";


export const getTimetableFilters = async (id) => {
  const response = await api.get(`timetable/filter_options/?generated_schedule_id=${id}`);
  return response.data;
};