import { Card, Typography, Button } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const SuccessDepositPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const amount = params.get("amount");

  const formatCurrency = (value: string | null) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
        padding: 20
      }}
    >
      <Card
        style={{ 
          maxWidth: 460, 
          width: "100%", 
          borderRadius: 24, 
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)", 
          border: "1px solid #f0f0f0" 
        }}
        bodyStyle={{ padding: 48 }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Success Icon */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#52c41a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 4px 20px rgba(82,196,26,0.3)"
          }}>
            <CheckCircleOutlined style={{ fontSize: 56, color: "#fff" }} />
          </div>

          {/* Success Message */}
          <Title level={3} style={{ 
            marginTop: 0, 
            marginBottom: 24, 
            color: '#52c41a',
            fontSize: 28,
            fontWeight: 600
          }}>
            Nạp tiền thành công!
          </Title>

          {/* Amount Info */}
          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Bạn đã nạp{" "}
            </Text>
            <Text style={{ 
              fontSize: 20, 
              color: '#1890ff', 
              fontWeight: 600 
            }}>
              {formatCurrency(amount)} VNĐ
            </Text>
          </div>
          
          <Text style={{ fontSize: 16, color: '#666', display: "block", marginBottom: 24 }}>
            cho tài khoản
          </Text>

          {/* Thank you message */}
          <Text style={{ 
            fontSize: 14, 
            color: '#999', 
            display: "block",
            marginBottom: 32
          }}>
            Cảm ơn bạn đã sử dụng dịch vụ của JobBox!
          </Text>

          {/* Back Button */}
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            block
            size="large"
            style={{ 
              height: 48,
              borderRadius: 12, 
              fontWeight: 600, 
              fontSize: 16, 
              background: "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)", 
              border: "none",
              boxShadow: "0 4px 12px rgba(24,144,255,0.3)" 
            }}
            onClick={() => navigate("/dashboard")}
          >
            Quay lại Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuccessDepositPage;
