import { useState } from "react";
import { Button, Form, InputNumber, message, Card, Typography } from "antd";
import { depositToUser } from "./deposit.service";
import { useAuthStore } from "../../stores/useAuthorStore";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const DepositPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userId = useAuthStore((state) => state.loggedInUser?.id);
  const userName = useAuthStore((state) => state.loggedInUser?.username);

  const onFinish = async (values: { amount: number }) => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }
    setLoading(true);
    try {
      const url = await depositToUser(values.amount, Number(userId));
      window.open(url, "_blank");
      message.success("Chuyển hướng đến trang thanh toán!");
    } catch (error) {
      message.error("Nạp tiền thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
        padding: 20,
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 36 }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1890ff, #40a9ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 4px 16px rgba(24,144,255,0.3)",
            }}
          >
            <DollarCircleOutlined style={{ fontSize: 38, color: "#fff" }} />
          </div>
          <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
           Deposit money into account
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            User Name: <b>{userName ?? "Không xác định"}</b>
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="amount"
            label={<span style={{ fontWeight: 600 }}>💵 Amount to deposit</span>}
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <InputNumber
              min={1000}
              step={1000}
              precision={0}
              placeholder="Enter amount (VND)"
              size="large"
              style={{ width: "100%", borderRadius: 12, border: "1px solid #d9d9d9" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 12,
                background: "linear-gradient(90deg,#1890ff 0%,#40a9ff 100%)",
                boxShadow: "0 4px 12px rgba(24,144,255,0.3)",
              }}
            >
              🚀 Deposit now
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DepositPage;
