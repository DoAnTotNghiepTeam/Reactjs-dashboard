import axios from "axios";

export const depositToUser = async (amount: number, userId: number) => {
  const response = await axios.get<string>(`http://localhost:8080/api/vnpay/create-payment?amount=${amount}&userId=${userId}`);
  return response.data;
};
