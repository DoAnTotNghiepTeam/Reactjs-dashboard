import axios from "axios";

interface VNPayResponse {
  message: string;
  success: boolean;
  paymentUrl: string;
}

interface PayPalResponse {
  amountUSD: number;
  approveUrl: string;
  success: boolean;
  orderId: string;
  amountVND: number;
}

export const depositToUserVNPay = async (amount: number, userId: number) => {
  const response = await axios.get<VNPayResponse>(`http://localhost:8080/api/payments/vnpay/create-payment?userId=${userId}&amount=${amount}`);
  return response.data.paymentUrl;
};

export const depositToUserPayPal = async (amount: number, userId: number) => {
  const response = await axios.get<PayPalResponse>(`http://localhost:8080/api/payments/paypal/create-payment?userId=${userId}&amount=${amount}`);
  return response.data.approveUrl;
};
