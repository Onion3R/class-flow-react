import api from '@/lib/api';

export const exportScreenshot = async (scheduleId, trackId, sectionIds) => {
  let url = `export-schedule/${scheduleId}`;
  const params = new URLSearchParams();
  if (trackId) params.append("track_id", trackId);
  if (sectionIds) params.append("section_ids", sectionIds);

  // Correct: first query parameter uses '?'
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url, { responseType: 'blob' });
  return response.data; // Blob for download
};





export const exportPdf = async (scheduleId, trackId, sectionIds) => {
  let url = `export-schedule-pdf/${scheduleId}`;
  const params = new URLSearchParams();
  if (trackId) params.append("track_id", trackId);
  if (sectionIds) params.append("section_ids", sectionIds);

  // Correct: first query parameter uses '?'
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url, { responseType: 'blob' });
  return response.data; // Blob for download
};



// teacher export png and pdf


export const teacherExportScreenShot = async (scheduleId, teacherId) => {
  let url = `export-teacher-timetable/${teacherId}/${scheduleId}`;

  console.log('url here', url)

  const response = await api.get(url, { responseType: 'blob' });
  return response.data; // Blob for download
};



export const teacherExportPdf = async (scheduleId, teacherId) => {
  let url = `export-teacher-timetable-pdf/${teacherId}/${scheduleId}`;

  console.log('url here', url)
  console.log('teacher export pdf', url)

  const response = await api.get(url, { responseType: 'blob' });
  return response.data; // Blob for download
};