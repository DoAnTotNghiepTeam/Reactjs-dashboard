import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Typography,
  Space,
  message,
  Modal,
} from "antd";
import AddBanner from "./components/AddBanner";
import EditBanner from "./components/UpdateBanner";
import { getBannersByUser } from "./banneremployer.service";
import { useAuthStore } from "../../stores/useAuthorStore";
import type { BannerEmployer } from "./banneremployer.type";
import dayjs from "dayjs";

const BannerEmployerPage = () => {
  const [banners, setBanners] = useState<BannerEmployer[]>([]);
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editBanner, setEditBanner] = useState<BannerEmployer | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const userId = useAuthStore((state) => state.loggedInUser?.id);

  useEffect(() => {
    if (typeof userId === "number") fetchBanners();
  }, [userId]);

  const fetchBanners = async () => {
    if (typeof userId !== "number") return;
    setLoading(true);
    try {
      const data = await getBannersByUser(userId);
      console.log("📊 Banner data from API:", data); // Debug: xem dữ liệu từ API
      setBanners(data);
    } catch (error) {
      console.error("❌ Error fetching banners:", error); // Debug: xem lỗi nếu có
      message.error("Không lấy được danh sách banner!");
    }
    setLoading(false);
  };


  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "Email", dataIndex: "companyEmail", key: "companyEmail", width: 200 },
    { 
      title: "Banner Type", 
      dataIndex: "bannerType", 
      key: "bannerType", 
      width: 120,
      render: (type: string) => {
        if (type === "Vip") return <Tag color="red">VIP</Tag>;
        if (type === "Featured") return <Tag color="green">FEATURED</Tag>;
        if (type === "Standard") return <Tag color="blue">STANDARD</Tag>;
        return <Tag>{type}</Tag>;
      }
    },
    { 
      title: "Start Date", 
      dataIndex: "startDate", 
      key: "startDate",
      width: 180,
      render: (date: string) => date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    { 
      title: "End Date", 
      dataIndex: "endDate", 
      key: "endDate",
      width: 180,
      render: (date: string) => date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: BannerEmployer["status"]) => {
        // PENDING - Chờ admin duyệt
        if (status === "PENDING") return <Tag color="orange">PENDING</Tag>;
        // ACTIVE - Đang hiển thị (đã duyệt và đến ngày)
        if (status === "ACTIVE") return <Tag color="green">ACTIVE</Tag>;
        // APPROVED - Admin đã duyệt nhưng chưa đến ngày
        if (status === "APPROVED") return <Tag color="blue">APPROVED</Tag>;
        // REJECTED - Admin từ chối
        if (status === "REJECTED") return <Tag color="red">REJECTED</Tag>;
        // EXPIRED - Đã hết hạn
        if (status === "EXPIRED") return <Tag color="default">EXPIRED</Tag>;
        return <Tag color="gray">{status}</Tag>; // Fallback
      },
    },
    {
      title: "Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
      width: 100,
      render: (url: string) =>
        url ? (
          <img
            src={
              url.startsWith("/uploads/")
                ? `http://localhost:8080${url}`
                : url
            }
            alt="banner"
            style={{ width: 80, borderRadius: 6, cursor: "pointer" }}
            onClick={() => {
              setPreviewImage(
                url.startsWith("/uploads/")
                  ? `http://localhost:8080${url}`
                  : url
              );
              setPreviewVisible(true);
            }}
          />
        ) : null,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: any, record: BannerEmployer) => {
        // Nếu status là PENDING hoặc APPROVED → hiển thị nút Update
        if (record.status === "PENDING" || record.status === "APPROVED") {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setEditBanner(record);
                setEditVisible(true);
              }}
            >
              Update
            </Button>
          );
        }
        
        // Nếu status là ACTIVE → hiển thị link xem banner
        if (record.status === "ACTIVE") {
          return (
            <Button
              type="link"
              size="small"
              href="http://localhost:3000"
              target="_blank"
            >
              Xem banner
            </Button>
          );
        }
        
        
        // Status REJECTED không hiển thị button
        return null;
      },
    }, 
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_: any, record: BannerEmployer) => (
    //     <Space>
    //       <Button
    //         size="small"
    //         onClick={() => {
    //           setEditBanner(record);
    //           setEditVisible(true);
    //         }}
    //       >
    //         Sửa
    //       </Button>

    //       {/* Cảnh báo/gia hạn nếu còn dưới 7 ngày */}
    //       {record.status === "ACTIVE" &&
    //         dayjs(record.endDate).diff(dayjs(), "day") <= 7 && (
    //           <Tag color="red">Sắp hết hạn</Tag>
    //         )}

    //       {record.status === "ACTIVE" &&
    //         dayjs(record.endDate).diff(dayjs(), "day") <= 7 && (
    //           <Button
    //             type="dashed"
    //             size="small"
    //             onClick={() => handleRenew(record)}
    //           >
    //             Gia hạn
    //           </Button>
    //         )}
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Typography.Title level={3}>Advertising rental management</Typography.Title>

      <Button
        type="primary"
        onClick={() => setAddVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Create new banner
      </Button>

      <Table
        dataSource={banners}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Modal tạo mới */}
      <AddBanner
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
          fetchBanners();
        }}
        userId={typeof userId === "number" ? userId : 0}
      />

      {/* Modal sửa */}
      {editVisible && editBanner && (
        <EditBanner
          visible={editVisible}
          onClose={() => {
            setEditVisible(false);
            setEditBanner(null);
            fetchBanners();
          }}
          banner={editBanner}
        />
      )}

      {/* Modal xem ảnh to */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={1000}
      >
        <img
          src={previewImage}
          alt="banner preview"
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Modal>
    </Card>
  );
};

export default BannerEmployerPage;
