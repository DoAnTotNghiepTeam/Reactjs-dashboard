import React, { useState } from "react";
import { Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchSystemLogsPaged } from "./systemlog.service";
import type { SystemLog } from "./systemlog.type";

const { Title } = Typography;

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 50 },
  {
    title: "Actor",
    dataIndex: "actor",
    key: "actor",
    render: (text: string) => (
      <span style={{ fontWeight: "bold", fontSize: 14 }}>{text}</span>
    ),
    width: 120,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text: string) => (
      <span style={{ fontWeight: "bold" }}>{text}</span>
    ),
    width: 120,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <span
        style={{
          fontWeight: "bold",
          color: status === "SUCCESS" ? "green" : "red",
          background: status === "SUCCESS" ? "#e6ffed" : "#fff1f0",
          padding: "2px 8px",
          borderRadius: 8,
          display: "inline-block",
          minWidth: 70,
          textAlign: "center",
        }}
      >
        {status}
      </span>
    ),
    width: 100,
  },
  { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", width: 180 },
];

const SystemLogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch nhiều log một lần để sort client-side
  const querySystemLogs = useQuery({
    queryKey: ["systemlogs"],
    queryFn: async () => fetchSystemLogsPaged(0, 1000), // lấy 1000 log mới nhất
    placeholderData: {
      data: [],
      pageNumber: 0,
      pageSize: 10,
      totalRecords: 0,
    },
  });

  // Sort toàn bộ logs theo Timestamp DESC
  const allLogs: SystemLog[] =
    (querySystemLogs.data?.data ?? []).slice().sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  // Cắt dữ liệu theo trang hiện tại
  const pagedLogs = allLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Pagination config cho AntD Table
  const pagination = {
    current: currentPage,
    pageSize,
    total: allLogs.length,
    onChange: (page: number) => setCurrentPage(page),
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        System Logs
      </Title>
      <Table
        columns={columns}
        dataSource={pagedLogs}
        rowKey="id"
        loading={querySystemLogs.isLoading}
        pagination={pagination}
        scroll={{ x: 800 }}
        style={{ minWidth: 700 }}
      />
    </div>
  );
};

export default SystemLogPage;
