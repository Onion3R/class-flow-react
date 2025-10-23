import api from "@/lib/api";




export const exportAdminScheduleExcel = async (scheduleId, filters) => {
  let url = `export-schedule-excel/${scheduleId}/`;
  const params = new URLSearchParams();

  if (filters.track_id) params.append("track_id", filters.track_id);
  if (filters.section_ids) params.append("section_ids", filters.section_ids);
  if (filters.strand_ids) params.append("strand_ids", filters.strand_ids);
  if (filters.year_level_ids) params.append("year_level_ids", filters.year_level_ids);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  

  const response = await api.get(url, { responseType: "blob" });
  return response; // ✅ Return full response, not just data
};
