import api from "@/lib/api";


export const getOperationalTeacherSpecialization = async (id) => {
  const response = await api.get(`operational-teacher-specializations/?schedule_id=${id}`);
  return response.data;
};

export const getOperationalTeachers = async (id) => {
  const response = await api.get(`operational-teachers/?schedule_id=${id}`);
  return response.data;
};
export const getOperationalSubjects = async (id) => {
  const response = await api.get(`operational-subjects/?schedule_id=${id}`);
  return response.data;
};
export const getOperationalStrands = async (id) => {
  const response = await api.get(`operational-strands/?schedule_id=${id}`);
  return response.data;
};

export const getOperationalSection = async (id) => {
  const response = await api.get(`operational-sections/?schedule_id=${id}`);
  return response.data;
};

export const getOperationalStrandSubjects = async (id) => {
  const response = await api.get(`operational-strand-subjects/?schedule_id=${id}`);
  return response.data;
};

