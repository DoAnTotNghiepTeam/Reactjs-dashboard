import axios from "axios";
import type { TransactionHistoryResponse } from "./deposit.type";

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

export const getTransactionHistory = async (userId: number) => {
  const response = await axios.get<TransactionHistoryResponse>(
    `http://localhost:8080/api/payments/transactions/${userId}`
  );
  return response.data;
};
