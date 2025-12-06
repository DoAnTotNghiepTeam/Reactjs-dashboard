import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Table, Button, Tag, Typography, Space, message, Modal, Input } from "antd";
import { fetchBannerAdmins, approveBannerAdmin, rejectBannerAdmin } from "./banneradmin.service";
import type { BannerAdminType } from "./banneradmin.type";
import BannerAdminDelete from "./components/BannerAdminDelete";

const BannerAdminPage = () => {
  const { data: banners = [], isLoading, refetch } = useQuery<BannerAdminType[]>({
    queryKey: ["banner-admins"],
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "Position", dataIndex: "bannerType ", key: "bannerType " },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => {
      if (status === "ACTIVE") return <Tag color="green">ACTIVE</Tag>;
      if (status === "REJECTED") return <Tag color="red">REJECTED</Tag>;
      return <Tag color="orange">PENDING</Tag>;
    }},
    { title: "Image", dataIndex: "bannerImage", key: "bannerImage", render: (url: string) => url ? (
      <img
        src={url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url}
        alt="banner"
        style={{ width: 80, borderRadius: 6, cursor: "pointer" }}
        onClick={() => {
          setPreviewImage(url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url);
          setPreviewVisible(true);
        }}
      />
    ) : null },
    { title: "Action", key: "action", render: (_: any, record: BannerAdminType) => (
      <Space>
        {(record.status === "PENDING") ? (
          <>
            <Button size="small" type="primary" onClick={() => handleApprove(record.id)}>Duyệt</Button>
            <Button size="small" danger onClick={() => { setRejectId(record.id); setRejectModal(true); }}>Từ chối</Button>
          </>
        ) : null}
        <BannerAdminDelete id={record.id} onDeleted={refetch} />
      </Space>
    )}
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Typography.Title level={3}>Banner Management</Typography.Title>
  <Table dataSource={banners} columns={columns} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} />
      <Modal
        open={rejectModal}
        title="Enter rejection reason"
        onCancel={() => { setRejectModal(false); setRejectReason(""); setRejectId(null); }}
        onOk={handleReject}
        okText="Reject"
        cancelText="Cancel"
      >
        <Input.TextArea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} placeholder="Enter rejection reason..." />
      </Modal>
      {/* Modal xem ảnh to */}
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

export default BannerAdminPage;
