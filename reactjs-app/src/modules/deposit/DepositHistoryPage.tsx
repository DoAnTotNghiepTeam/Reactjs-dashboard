import { useState, useEffect } from "react";
import { Card, Table, Tag, Typography, Button, Space, message } from "antd";
import { ArrowLeftOutlined, HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthorStore";
import { getTransactionHistory } from "./deposit.service";
import type { TransactionHistory } from "./deposit.type";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DepositHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.loggedInUser?.id);
  const userName = useAuthStore((state) => state.loggedInUser?.username);
  
// console log để check role của user
 console.log("check role user login", useAuthStore((state) => state.loggedInUser?.roles));
  
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    if (!userId) {
      message.error("User information not found!");
      return;
    }

    setLoading(true);
    try {
      const response = await getTransactionHistory(Number(userId));
      setTransactions(response.data || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error("Error fetching transaction history:", error);
      message.error(error.response?.data?.message || "Unable to load transaction history!");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const getStatusTag = (status: string) => {
    if (status === "SUCCESS") {
      return <Tag icon={<CheckCircleOutlined />} color="success">Success</Tag>;
    }
    return <Tag icon={<CloseCircleOutlined />} color="error">Failed</Tag>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Transaction Code",
      dataIndex: "txnRef",
      key: "txnRef",
      width: 140,
      render: (text: string) => (
        <Text copyable style={{ fontSize: 12, fontFamily: "monospace" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (amount: number) => (
        <Text strong style={{ color: "#1890ff", fontSize: 14 }}>
          {formatCurrency(amount)} ₫
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Payment Info",
      dataIndex: "orderInfo",
      key: "orderInfo",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
        padding: 24,
      }}
    >
      <Card
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 32 }}
      >
        {/* Header */}
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(24,144,255,0.3)",
                }}
              >
                <HistoryOutlined style={{ fontSize: 28, color: "#fff" }} />
              </div>
              <div>
                <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
                  Deposit History
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  User: <b>{userName ?? "Unknown"}</b> • Total: <b>{total}</b> transactions
                </Text>
              </div>
            </div>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={() => navigate("/deposit")}
              style={{ borderRadius: 8 }}
            >
              Back
            </Button>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} transactions`,
            }}
            scroll={{ x: 800 }}
            style={{ marginTop: 16 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default DepositHistoryPage;
