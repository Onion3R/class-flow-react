import api from "@/lib/api";

export const getGenerationHistory = async () => {
  const response = await api.get('generation-history/');
  return response.data;
};