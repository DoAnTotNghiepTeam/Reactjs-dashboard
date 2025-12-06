import { Card, Typography, Button } from "antd";
import { CheckCircleTwoTone, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessDepositPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const amount = params.get("amount");

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
            Nạp tiền thành công!
          </Typography.Title>
          <Typography.Text style={{ fontSize: 17, color: '#333' }}>
            Bạn đã nạp <b style={{ color: '#1890ff', fontSize: 18 }}>{amount ? Number(amount).toLocaleString() : "..."} VNĐ</b><br />
            cho tài khoản <b style={{ color: '#1890ff' }}>{userId}</b>
          </Typography.Text>
          <div style={{ marginTop: 18, color: '#888', fontSize: 15 }}>
            Cảm ơn bạn đã sử dụng dịch vụ của JobBox!
          </div>
        </div>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          block
          size="large"
          style={{ borderRadius: 14, fontWeight: 600, fontSize: 17, background: "linear-gradient(90deg,#1890ff 0%,#40a9ff 100%)", boxShadow: "0 4px 12px rgba(24,144,255,0.18)" }}
          onClick={() => navigate("/dashboard")}
        >
          Quay lại Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default SuccessDepositPage;
