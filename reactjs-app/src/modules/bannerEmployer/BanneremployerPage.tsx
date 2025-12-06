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
import EditBanner from "./components/EditBanner";
import { getBannersByUser, renewBanner } from "./banneremployer.service";
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
      setBanners(data);
    } catch {
      message.error("Không lấy được danh sách banner!");
    }
    setLoading(false);
  };

  const handleRenew = (banner: BannerEmployer) => {
    Modal.confirm({
      title: "Gia hạn banner",
      content: "Bạn muốn gửi yêu cầu gia hạn banner này?",
      onOk: async () => {
        try {
          await renewBanner({
            ...banner,
            startDate: dayjs(banner.endDate)
              .add(1, "day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            endDate: dayjs(banner.endDate)
              .add(8, "day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            status: "PENDING",
            id: undefined, // Tạo mới
          });
          message.success("Đã gửi yêu cầu gia hạn!");
          fetchBanners();
        } catch {
          message.error("Gửi yêu cầu gia hạn thất bại!");
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "Banner Type", dataIndex: "bannerType", key: "bannerType" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: BannerEmployer["status"]) => {
        if (status === "ACTIVE") return <Tag color="green">ACTIVE</Tag>;
        if (status === "REJECTED") return <Tag color="red">REJECTED</Tag>;
        return <Tag color="orange">PENDING</Tag>;
      },
    },
    {
      title: "Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
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
    // action 
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
