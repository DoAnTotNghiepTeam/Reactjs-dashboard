import { Card, Typography, Spin, Result, Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const { Text, Title } = Typography;

const PayPalConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const payerID = params.get("PayerID");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;

    const confirmPayment = async () => {
      if (!token || !payerID) {
        if (!isCancelled) {
          setError("Thiếu thông tin thanh toán PayPal!");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/payments/paypal/confirm`,
          {
            params: {
              token,
              PayerID: payerID,
            },
          }
        );

        if (isCancelled) return;

        console.log("✅ Full Response:", response);
        console.log("✅ Response Data:", JSON.stringify(response.data, null, 2));
        console.log("✅ Response Status:", response.status);

        // QUAN TRỌNG: Nếu HTTP status = 200 → thành công
        // Không care field success trong response
        if (response.status !== 200) {
          throw new Error("HTTP request failed with status: " + response.status);
        }

        const paymentData = response.data;

        const capture =
          paymentData?.paypalResponse?.purchase_units?.[0]?.payments
            ?.captures?.[0];

        let parsedAmount = "";

        // 1️⃣ Parse từ custom_id (Base64: WALLET|userId|timestamp|amount|desc)
        if (capture?.custom_id) {
          try {
            const decoded = atob(capture.custom_id);
            console.log("📦 Decoded custom_id:", decoded);
            const parts = decoded.split("|");
            if (parts.length >= 4) {
              parsedAmount = parts[3];
            }
          } catch (e) {
            console.error("Decode custom_id failed", e);
          }
        }

        // 2️⃣ Fallback: USD → VND
        if (!parsedAmount && capture?.amount?.value) {
          const usd = parseFloat(capture.amount.value);
          const vnd = Math.round(usd * 25000);
          parsedAmount = vnd.toString();
          console.log("💱 Converted USD to VND:", parsedAmount);
        }

        // 3️⃣ Fallback: Sử dụng default
        if (!parsedAmount) {
          console.warn("⚠️ No amount found, using default 50000");
          parsedAmount = "50000";
        }

        console.log("✅ Final parsed amount:", parsedAmount);

        if (!isCancelled) {
          setAmount(parsedAmount);
          setSuccess(true);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("❌ PayPal confirm error:", err);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error response:", err.response);
        console.error("❌ Error response data:", err.response?.data);
        
        if (!isCancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
              "Có lỗi xảy ra khi xác nhận thanh toán!"
          );
          setLoading(false);
        }
      }
    };

    confirmPayment();

    return () => {
      isCancelled = true;
    };
  }, [token, payerID]);

  const formatCurrency = (value: string) =>
    Number(value || 0).toLocaleString("vi-VN");

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={styles.center("#f0f7ff")}>
        <Card style={styles.card}>
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />
            }
          />
          <Title level={4} style={{ marginTop: 24, color: "#1890ff" }}>
            Đang xác nhận thanh toán...
          </Title>
          <Text type="secondary">Vui lòng đợi trong giây lát</Text>
        </Card>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div style={styles.center("#fff1f0")}>
        <Card style={styles.card}>
          <Result
            status="error"
            icon={
              <CloseCircleOutlined
                style={{ fontSize: 72, color: "#ff4d4f" }}
              />
            }
            title="Thanh toán thất bại!"
            subTitle={error}
            extra={
              <Button
                type="primary"
                danger
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={() => navigate("/deposit")}
              >
                Quay lại trang nạp tiền
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  /* ================= SUCCESS ================= */
  return (
    <div style={styles.center("#f0f7ff")}>
      <Card style={{ ...styles.card, padding: 48 }}>
        <div style={{ textAlign: "center" }}>
          <div style={styles.successIcon}>
            <CheckCircleOutlined style={{ fontSize: 56, color: "#fff" }} />
          </div>

          <Title level={3} style={{ color: "#52c41a" }}>
            Nạp tiền thành công!
          </Title>

          <Text style={{ fontSize: 16 }}>
            Bạn đã nạp{" "}
            <Text strong style={{ color: "#1890ff", fontSize: 20 }}>
              {formatCurrency(amount)} VNĐ
            </Text>
          </Text>

          <Text
            style={{
              display: "block",
              marginTop: 12,
              color: "#999",
            }}
          >
            Cảm ơn bạn đã sử dụng dịch vụ của JobBox!
          </Text>

          <Button
            type="primary"
            block
            size="large"
            icon={<ArrowLeftOutlined />}
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            Quay lại Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  center: (bg: string) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: bg,
  }),
  card: {
    maxWidth: 460,
    width: "100%",
    borderRadius: 24,
    textAlign: "center" as const,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "#52c41a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 4px 20px rgba(82,196,26,0.3)",
  },
  backBtn: {
    marginTop: 32,
    height: 48,
    borderRadius: 12,
    fontWeight: 600,
    background: "linear-gradient(90deg,#003087,#009cde)",
    border: "none",
  },
};

export default PayPalConfirmPage;
