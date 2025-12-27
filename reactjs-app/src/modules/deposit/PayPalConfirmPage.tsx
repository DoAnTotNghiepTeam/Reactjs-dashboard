import { Card, Typography, Spin, Result, Button } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone, ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PayPalConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const PayerID = params.get("PayerID");
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!token || !PayerID) {
        setError("Thiếu thông tin thanh toán!");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/payments/paypal/confirm?token=${token}&PayerID=${PayerID}`
        );
        
        setPaymentData(response.data);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || "Có lỗi xảy ra khi xác nhận thanh toán!");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [token, PayerID]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#e6f7ff 0%,#f9f9f9 100%)" }}>
        <Card style={{ maxWidth: 440, width: "100%", borderRadius: 28, textAlign: "center", padding: 40 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />} />
          <Typography.Title level={4} style={{ marginTop: 24, color: "#1890ff" }}>
            Đang xác nhận thanh toán...
          </Typography.Title>
          <Typography.Text type="secondary">
            Vui lòng đợi trong giây lát
          </Typography.Text>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff1f0 0%,#f9f9f9 100%)" }}>
        <Card style={{ maxWidth: 440, width: "100%", borderRadius: 28, boxShadow: "0 12px 40px rgba(255,77,79,0.10)" }}>
          <Result
            status="error"
            icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 72 }} />}
            title="Thanh toán thất bại!"
            subTitle={error}
            extra={
              <Button
                type="primary"
                danger
                icon={<ArrowLeftOutlined />}
                size="large"
                style={{ borderRadius: 14, fontWeight: 600, fontSize: 17 }}
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#e6f7ff 0%,#f9f9f9 100%)" }}>
      <Card
        style={{ maxWidth: 440, width: "100%", borderRadius: 28, boxShadow: "0 12px 40px rgba(24,144,255,0.10)", border: "1px solid #e6f7ff" }}
        bodyStyle={{ padding: 44 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#52c41a 60%,#b7eb8f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            boxShadow: "0 4px 16px rgba(82,196,26,0.18)"
          }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 54 }} />
          </div>
          <Typography.Title level={3} style={{ marginTop: 18, marginBottom: 10, color: '#52c41a' }}>
            Nạp tiền thành công qua PayPal!
          </Typography.Title>
          
          {paymentData && (
            <>
              <Typography.Text style={{ fontSize: 17, color: '#333' }}>
                Bạn đã nạp <b style={{ color: '#1890ff', fontSize: 18 }}>
                  ${paymentData.paypalResponse?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || "..."}
                </b>
              </Typography.Text>
              <div style={{ marginTop: 12, padding: 16, background: "#f6f8fa", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <Typography.Text type="secondary">Mã giao dịch:</Typography.Text>
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    {paymentData.paypalResponse?.id?.substring(0, 20)}...
                  </Typography.Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography.Text type="secondary">Trạng thái:</Typography.Text>
                  <Typography.Text style={{ color: "#52c41a", fontWeight: 600 }}>
                    {paymentData.paypalResponse?.status}
                  </Typography.Text>
                </div>
              </div>
            </>
          )}
          
          <div style={{ marginTop: 18, color: '#888', fontSize: 15 }}>
            Cảm ơn bạn đã sử dụng dịch vụ của JobBox!
          </div>
        </div>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          block
          size="large"
          style={{ borderRadius: 14, fontWeight: 600, fontSize: 17, background: "linear-gradient(90deg,#003087 0%,#009cde 100%)", boxShadow: "0 4px 12px rgba(0,48,135,0.18)" }}
          onClick={() => navigate("/dashboard")}
        >
          Quay lại Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default PayPalConfirmPage;
