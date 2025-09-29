import api from "@/lib/api";

export const getRoles = async () => {
  const response = await api.get('roles/');
  return response.data;
};