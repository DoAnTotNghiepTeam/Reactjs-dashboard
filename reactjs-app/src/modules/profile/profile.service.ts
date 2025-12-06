import axios from "axios";

export const fetchProfile = async (userId: number | string) => {
  const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: number,
  payload: Record<string, any>
): Promise<any> => {
  const res = await axios.patch(`http://localhost:8080/api/users/${userId}`, payload);
  return res.data;
};

