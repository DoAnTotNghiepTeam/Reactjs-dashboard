"use client";

import { Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type React from "react";
import { useEffect, useState } from "react";
import TiptapEditor from "./TiptapEditor"; // Import TiptapEditor
import "./tiptap.css"; // Updated import path for styles
import type { BlogType, CreateBlogRequest, CategoryType } from "./blog.type"; // Updated import path
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;

interface BlogFormProps {
  blog?: BlogType;
  categories: CategoryType[];
  onSubmit: (values: CreateBlogRequest & { categoryId: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blog,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [base64Image, setBase64Image] = useState<string>("");

  useEffect(() => {
    if (blog) {
      console.log("Setting form values for blog:", blog); // Debug log
      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        summary: blog.summary,
        categoryId: blog.category.id,
      });

      // Nếu có ảnh từ blog hiện tại (base64), hiển thị preview
      if (blog.imageUrl) {
        setBase64Image(blog.imageUrl);
        setFileList([
          {
            uid: "-1",
            name: "current-image.jpg",
            status: "done",
            url: blog.imageUrl,
          },
        ]);
      } else {
        // Reset image states if no image
        setBase64Image("");
        setFileList([]);
      }
    } else {
      // Reset form when creating new blog
      form.resetFields();
      setBase64Image("");
      setFileList([]);
    }
  }, [blog, form]);

  const handleSubmit = (values: CreateBlogRequest & { categoryId: number }) => {
    console.log("[BlogForm] Submit data:", values);
    console.log("[BlogForm] Base64 image:", base64Image);

    // Đảm bảo imageUrl LUÔN là string
    const imageValue =
      typeof (values as { imageUrl?: unknown }).imageUrl === "string"
        ? (values as { imageUrl?: string }).imageUrl
        : base64Image || blog?.imageUrl || "";

    type SubmitPayload = CreateBlogRequest & { categoryId: number };
    const baseData: SubmitPayload = {
      ...values,
      imageUrl: imageValue,
    };
    const submitData: SubmitPayload = baseData;

    console.log("[BlogForm] Final submit data:", submitData);
    onSubmit(submitData);
  };

  // Hàm chuyển đổi file thành base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;

    console.log("Upload started:", file); // Debug log

    try {
      // Kiểm tra loại file
      const isImage = (file as File).type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return;
      }

      // Kiểm tra kích thước file (tăng lên 10MB để thực tế hơn)
      const isLt10M = (file as File).size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Kích thước ảnh không được vượt quá 10MB!");
        return;
      }

      console.log("File validation passed, converting to base64..."); // Debug log

      // Chuyển đổi file thành base64
      const base64String = await convertToBase64(file as File);

      console.log("Base64 conversion completed, length:", base64String.length); // Debug log

      // Cập nhật state
      setBase64Image(base64String);

      // Cập nhật giá trị cho Form - đảm bảo form nhận được giá trị
      form.setFieldsValue({ imageUrl: base64String });

      // Force form validation để đảm bảo field được validate
      form.validateFields(["imageUrl"]).catch(() => {
        // Ignore validation errors, just trigger validation
      });

      // Cập nhật fileList để hiển thị trong UI
      const newFileList = [
        {
          uid:
            typeof file === "string"
              ? file
              : (file as { uid?: string }).uid || Date.now().toString(),
          name:
            typeof file === "string"
              ? "image.jpg"
              : (file as { name?: string }).name || "image.jpg",
          status: "done" as const,
          url: base64String, // Sử dụng base64 làm URL để hiển thị
        },
      ];

      console.log("Setting fileList:", newFileList); // Debug log
      setFileList(newFileList);

      if (onSuccess) {
        onSuccess({ url: base64String });
      }

      message.success("Chuyển đổi ảnh thành công!");
    } catch (error) {
      console.error("Convert error:", error);
      message.error("Chuyển đổi ảnh thất bại!");
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setBase64Image("");
    form.setFieldsValue({ imageUrl: undefined }); // Xóa giá trị trong Form

    // Force form validation để đảm bảo field được validate lại
    form.validateFields(["imageUrl"]).catch(() => {
      // Ignore validation errors, just trigger validation
    });
  };

  const handlePreview = async (file: UploadFile) => {
    // Preview sẽ được xử lý bởi Ant Design Upload component
    console.log("Preview file:", file);
  };

  const uploadProps: UploadProps = {
    name: "file",
    listType: "picture-card",
    fileList: fileList,
    multiple: false,
    beforeUpload: (file) => {
      // Kiểm tra loại file
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return false;
      }

      // Kiểm tra kích thước file (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Kích thước ảnh không được vượt quá 10MB!");
        return false;
      }

      return true;
    },
    customRequest: handleImageUpload,
    onRemove: () => {
      handleRemove();
      return true;
    },
    onChange: (info) => {
      // Đồng bộ fileList trong trường hợp AntD tự cập nhật tạm thời
      if (info.file.status === "removed") return;
      if (info.fileList && info.fileList.length > 0) {
        setFileList(info.fileList.slice(-1));
      }
    },
    onPreview: handlePreview,
    maxCount: 1,
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onFinishFailed={(error) => {
        console.log("[BlogForm] Form validate failed:", error);
        message.error("Vui lòng điền đầy đủ thông tin hợp lệ!");
      }}
      initialValues={{
        categoryId: categories[0]?.id,
      }}
    >
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[
          { required: true, message: "Vui lòng nhập tiêu đề!" },
          { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự!" },
        ]}
      >
        <Input placeholder="Nhập tiêu đề blog" />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[
          { required: true, message: "Vui lòng nhập slug!" },
          {
            pattern: /^[a-z0-9-]+$/,
            message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang!",
          },
        ]}
      >
        <Input placeholder="Nhập slug (ví dụ: bai-viet-moi)" />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Danh mục"
        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
      >
        <Select placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="summary"
        label="Tóm tắt"
        rules={[
          { required: true, message: "Vui lòng nhập tóm tắt!" },
          { min: 10, message: "Tóm tắt phải có ít nhất 10 ký tự!" },
        ]}
      >
        <TextArea rows={3} placeholder="Nhập tóm tắt blog" />
      </Form.Item>

      <Form.Item
        name="content"
        label="Nội dung"
        rules={[
          { required: true, message: "Vui lòng nhập nội dung!" },
          {
            validator: async (_, value) => {
              // Tiptap có thể trả về '<p></p>' cho nội dung trống
              if (
                !value ||
                value === "<p></p>" ||
                value.replace(/<(.|\n)*?>/g, "").trim().length < 20
              ) {
                return Promise.reject(
                  new Error("Nội dung phải có ít nhất 20 ký tự!")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <TiptapEditor />
      </Form.Item>

      {/* Upload không bind trực tiếp vào field để tránh gửi object */}
      <Form.Item
        label="Ảnh bìa"
        required={!blog}
        validateStatus={!blog && !base64Image ? "error" : undefined}
        help={!blog && !base64Image ? "Vui lòng chọn ảnh bìa!" : undefined}
      >
        <Upload {...uploadProps}>
          {fileList.length < 1 && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      {/* Field ẩn để submit base64 image vào form */}
      <Form.Item
        name="imageUrl"
        hidden
        rules={[
          {
            validator: async (_, value) => {
              if (!blog && !value) {
                return Promise.reject(new Error("Vui lòng chọn ảnh bìa!"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {blog ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default BlogForm;
