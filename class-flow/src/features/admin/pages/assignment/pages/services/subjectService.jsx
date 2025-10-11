import api from "@/lib/api";


export const addSubject = async (data) => {
  const response = await api.post('subjects/',data);
  console.log(response)
  return response.data;
};
export const updateSubject = async (id,data) => {
  const response = await api.put(`subjects/${id}/`,data);
  console.log(response)
  return response.data;
};



