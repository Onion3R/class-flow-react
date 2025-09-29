import api from "@/lib/api";
export const getTeachers = async () => {
  const response = await api.get('teachers/');
  return response.data;
};
export const getTeacherWorkLoad = async () => {
  const response = await api.get('teacher-workloads/');
  return response.data;
};

export const addTeacher = async (data) => {
  const response = await api.post('teachers/',data);
  return response.data;
};

export const updateTeacher = async (teachersId, data) => {
  const response = await api.put(`teachers/${teachersId}/`, data);
  return response.data;
};

export const deleteTeacher = async (teachersId) => {
  const response = await api.delete(`teachers/${teachersId}/`);
  return response.data;
};





