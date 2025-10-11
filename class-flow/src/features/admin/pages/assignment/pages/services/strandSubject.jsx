import api from "@/lib/api";


export const addStrandSubject = async (data) => {
  const response = await api.post('strand-subjects/',data);
  console.log(response)
  return response.data;
};