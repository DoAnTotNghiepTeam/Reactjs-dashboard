export interface DepositPayload {
  amount: number;
  userId: number;
}

export interface TransactionHistory {
  id: number;
  txnRef: string;
  amount: number;
  status: string;
  responseCode: string;
  orderInfo: string;
  transactionNo: string | null;
  bankCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  total: number;
  message: string;
  data: TransactionHistory[];
}
