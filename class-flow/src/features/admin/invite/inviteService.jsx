import api from "@/lib/api";

export const validateToken = async (token) => {
  const response = await api.post("validate-token/", { token });
  return response.data;
};
export const createInvite = async (data) => {
  const response = await api.post("firebase-invites/", data);
  return response.data;
};
