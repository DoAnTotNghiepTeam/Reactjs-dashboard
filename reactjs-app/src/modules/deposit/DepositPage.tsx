import { useState } from "react";
import { Button, Form, InputNumber, message, Card, Typography, Radio } from "antd";
import { depositToUserVNPay, depositToUserPayPal } from "./deposit.service";
import { useAuthStore } from "../../stores/useAuthorStore";
import { DollarCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const DepositPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "paypal">("paypal");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.loggedInUser?.id);
  const userName = useAuthStore((state) => state.loggedInUser?.username);
  const [amount, setAmount] = useState<number>(50000);

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const onFinish = async (values: { amount: number }) => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }
    setLoading(true);
    try {
      let paymentUrl: string;
      if (paymentMethod === "vnpay") {
        paymentUrl = await depositToUserVNPay(values.amount, Number(userId));
      } else {
        paymentUrl = await depositToUserPayPal(values.amount, Number(userId));
      }
      
      console.log("Payment URL:", paymentUrl);
      console.log("Payment Method:", paymentMethod);
      
      if (!paymentUrl || paymentUrl.trim() === "") {
        message.error("Không nhận được URL thanh toán!");
        setLoading(false);
        return;
      }
      
      // Lưu amount vào localStorage trước khi redirect
      localStorage.setItem("pendingDepositAmount", values.amount.toString());
      
      // Chuyển hướng trình duyệt đến trang thanh toán
      window.location.href = paymentUrl;
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(error.response?.data?.message || "Nạp tiền thất bại!");
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ flex: 1 }}></div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(24,144,255,0.3)",
              }}
            >
              <DollarCircleOutlined style={{ fontSize: 38, color: "#fff" }} />
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={() => navigate("/deposit/history")}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 6,
                  padding: "6px 14px",
                  height: "auto",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "#fff",
                  border: "1.5px solid #d9d9d9",
                  borderRadius: 24,
                  color: "#1890ff",
                  transition: "all 0.25s ease",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1890ff";
                  e.currentTarget.style.background = "#f0f7ff";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(24,144,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#d9d9d9";
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View History
              </Button>
            </div>
          </div>
          <Title level={3} style={{ marginTop: 0, marginBottom: 8 }}>
           Deposit money into account
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            User Name: <b>{userName ?? "Không xác định"}</b>
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ amount: 50000 }}>
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
              onChange={(value) => setAmount(value || 0)}
            />
          </Form.Item>
          <div style={{ marginTop: -16, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: "#1890ff" }}>
              Amount: {formatCurrency(amount)} ₫
            </Text>
          </div>

          <Form.Item label={<span style={{ fontWeight: 600 }}>Payment method</span>}>
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "100%", display: "flex", gap: 16 }}
            >
              <Radio value="vnpay" style={{ flex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%2311468F'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='white' font-weight='bold'%3EVN%3C/text%3E%3C/svg%3E" 
                    alt="VNPay" 
                    style={{ width: 20, height: 20 }}
                  />
                  VNPay
                </span>
              </Radio>
              <Radio value="paypal" style={{ flex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23003087'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='white' font-weight='bold'%3EPP%3C/text%3E%3C/svg%3E" 
                    alt="PayPal" 
                    style={{ width: 20, height: 20 }}
                  />
                  PayPal
                </span>
              </Radio>
            </Radio.Group>
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
                background: paymentMethod === "paypal" 
                  ? "linear-gradient(90deg, #003087 0%, #009cde 100%)"
                  : "linear-gradient(90deg, #11468F 0%, #0066CC 100%)",
                boxShadow: "0 4px 12px rgba(24,144,255,0.3)",
              }}
            >
              {paymentMethod === "paypal" ? "🚀 Pay with PayPal" : "🚀 Pay with VNPay"}
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Secured by {paymentMethod === "paypal" ? "PayPal" : "VNPay"} - Vietnam's leading payment gateway
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DepositPage;
