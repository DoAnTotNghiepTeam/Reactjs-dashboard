import { Table, Card, Button, Spin, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import type { BlogType } from "./blog.type";

interface BlogTableProps {
  data?: BlogType[];
  loading: boolean;
  onEdit?: (blog: BlogType) => void;
  onDelete?: (id: number) => void;
  onPreview?: (blog: BlogType) => void;
  onAddClick?: () => void;
}

const BlogTable: React.FC<BlogTableProps> = ({
  data = [],
  loading,
  onEdit,
  onDelete,
  onPreview,
  onAddClick,
}) => {
  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const columns: ColumnsType<BlogType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      ellipsis: true,
    },
    {
      title: "Tóm tắt",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
      render: (summary: string) =>
        summary || <span style={{ color: "#999" }}>Chưa có tóm tắt</span>,
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="blog"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>Chưa có hình</span>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 190,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 5 }}>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onPreview?.(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa blog này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Blog Management"
      extra={
        onAddClick ? (
          <Button type="primary" onClick={onAddClick}>
            Add New Blog
          </Button>
        ) : null
      }
    >
      {loading ? (
        <Spin tip="Đang tải...">
          <div className="content" />
        </Spin>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} blog`,
          }}
        />
      )}
    </Card>
  );
};

export default BlogTable;
