import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Table, Button, Tag, Select, Space } from "antd";
import { fetchActiveBanners, fetchApprovedBanners } from "./banneradmin.service";
import type { BannerAdminType } from "./banneradmin.type";
import dayjs from "dayjs";

type FilterType = "ACTIVE" | "APPROVED";

const BannerListPage = () => {
  const [filter, setFilter] = useState<FilterType>("ACTIVE");

  // Query cho Active banners
  const { data: activeBanners = [], isLoading: loadingActive, refetch: refetchActive } = useQuery<BannerAdminType[]>({
    queryKey: ["banners-active"],
    queryFn: fetchActiveBanners,
    enabled: filter === "ACTIVE",
  });

  // Query cho Approved banners
  const { data: approvedBanners = [], isLoading: loadingApproved, refetch: refetchApproved } = useQuery<BannerAdminType[]>({
    queryKey: ["banners-approved"],
    queryFn: fetchApprovedBanners,
    enabled: filter === "APPROVED",
  });

  const isLoading = filter === "ACTIVE" ? loadingActive : loadingApproved;
  const banners = filter === "ACTIVE" ? activeBanners : approvedBanners;

  const handleRefetch = () => {
    if (filter === "ACTIVE") {
      refetchActive();
    } else {
      refetchApproved();
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
      width: 180,
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 180,
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        if (status === "ACTIVE") return <Tag color="green">ACTIVE</Tag>;
        if (status === "APPROVED") return <Tag color="blue">APPROVED</Tag>;
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
            style={{ width: 80, borderRadius: 6 }}
          />
        ) : null,
    },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Banner List</h2>
          <Space>
            <Select
              value={filter}
              onChange={(value) => setFilter(value)}
              style={{ width: 200 }}
            >
              <Select.Option value="ACTIVE">🟢 Active Banners</Select.Option>
              <Select.Option value="APPROVED">🔵 Approved Banners</Select.Option>
            </Select>
            <Button onClick={handleRefetch}>Refresh</Button>
          </Space>
        </div>

        <Table
          dataSource={banners}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Space>
    </Card>
  );
};

export default BannerListPage;
