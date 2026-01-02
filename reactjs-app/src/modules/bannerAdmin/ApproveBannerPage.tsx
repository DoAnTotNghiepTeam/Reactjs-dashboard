import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Table, Button, Tag, Typography, Space, message, Modal, Input } from "antd";
import { fetchBannerAdmins, approveBannerAdmin, rejectBannerAdmin } from "./banneradmin.service";
import type { BannerAdminType } from "./banneradmin.type";
import BannerAdminDelete from "./components/BannerAdminDelete";
import dayjs from "dayjs";

const ApproveBannerPage = () => {
  const { data: banners = [], isLoading, refetch } = useQuery<BannerAdminType[]>({
    queryKey: ["banner-admins-approve"],
    queryFn: fetchBannerAdmins,
  });

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleApprove = async (id: number) => {
    try {
      await approveBannerAdmin(id);
      message.success("Approve banner successfully!");
      refetch();
    } catch {
      message.error("Approve banner failed!");
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await rejectBannerAdmin(rejectId, rejectReason);
      message.success("Reject banner successfully!");
      setRejectModal(false);
      setRejectReason("");
      setRejectId(null);
      refetch();
    } catch {
      message.error("Reject banner failed!");
    }
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
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        if (status === "ACTIVE") return <Tag color="green">ACTIVE</Tag>;
        if (status === "APPROVED") return <Tag color="blue">APPROVED</Tag>;
        if (status === "REJECTED") return <Tag color="red">REJECTED</Tag>;
        if (status === "PENDING") return <Tag color="orange">PENDING</Tag>;
        if (status === "EXPIRED") return <Tag color="default">EXPIRED</Tag>;
        return <Tag>{status}</Tag>;
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
            src={url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url}
            alt="banner"
            style={{ width: 80, borderRadius: 6, cursor: "pointer" }}
            onClick={() => {
              setPreviewImage(url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url);
              setPreviewVisible(true);
            }}
          />
        ) : null,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: BannerAdminType) => (
        <Space>
          {record.status === "PENDING" && (
            <>
              <Button size="small" type="primary" onClick={() => handleApprove(record.id)}>
                Approve
              </Button>
              <Button
                size="small"
                danger
                onClick={() => {
                  setRejectId(record.id);
                  setRejectModal(true);
                }}
              >
                Reject
              </Button>
            </>
          )}
          <BannerAdminDelete id={record.id} onDeleted={refetch} />
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Typography.Title level={3}>Approve Banner Management</Typography.Title>

      <Table
        dataSource={banners}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      {/* Modal Reject */}
      <Modal
        title="Reject Banner"
        open={rejectModal}
        onOk={handleReject}
        onCancel={() => {
          setRejectModal(false);
          setRejectReason("");
          setRejectId(null);
        }}
        okText="Reject"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter reject reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* Modal Preview Image */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={1000}
      >
        <img src={previewImage} alt="banner preview" style={{ width: "100%", borderRadius: 8 }} />
      </Modal>
    </Card>
  );
};

export default ApproveBannerPage;
