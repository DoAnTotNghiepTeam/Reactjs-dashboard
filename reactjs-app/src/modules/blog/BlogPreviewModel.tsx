import React from "react";
import { Modal, Typography, Tag, Divider } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { BlogType } from "./blog.type";

const { Title, Paragraph } = Typography;

interface BlogPreviewModalProps {
  visible: boolean;
  blog: BlogType | null;
  onClose: () => void;
}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  visible,
  blog,
  onClose,
}) => {
  if (!blog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal
      title="Xem trước Blog"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Blog Image */}
        {blog.imageUrl && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{
                maxWidth: "100%",
                // maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {/* Blog Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Tag
              color="blue"
              style={{
                fontSize: 14,
                padding: "4px 12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {blog.category?.name || "Blog"}
            </Tag>
          </div>

          <Title level={2} style={{ marginBottom: 16, textAlign: "center" }}>
            {blog.title}
          </Title>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              color: "#666",
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarOutlined />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ClockCircleOutlined />
              <span>Đọc 5 phút</span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Blog Summary */}
        {blog.summary && (
          <div style={{ marginBottom: 24 }}>
            <Paragraph
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "#333",
                fontStyle: "italic",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                padding: 16,
                borderRadius: 8,
                borderLeft: "4px solid #1890ff",
              }}
            >
              {blog.summary}
            </Paragraph>
          </div>
        )}
        {/* Blog Content */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Blog Metadata */}
        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#666",
            fontSize: 14,
          }}
        >
          <div>
            <strong>Slug:</strong> {blog.slug}
          </div>
          <div>
            <strong>Cập nhật:</strong> {formatDate(blog.updatedAt)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BlogPreviewModal;
