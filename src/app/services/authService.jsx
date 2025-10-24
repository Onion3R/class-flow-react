import api from "@/lib/api";


export const verifyToken = async (idToken) => {
  const response = await api.get("auth/verify-token", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

