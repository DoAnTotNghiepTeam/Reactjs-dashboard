import { Form, Input, Button, Upload, message } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { RcFile } from "antd/es/upload";
import type { OurTeam, CreateOurTeamRequest } from "./ourTeam.type";
import { ourTeamService } from "./ourTeam.service";

interface OurTeamFormProps {
  initialValues?: OurTeam;
  onSuccess: () => void;
  onCancel: () => void;
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error("Image must smaller than 10MB!");
  }
  return isJpgOrPng && isLt10M;
};

const OurTeamForm = ({
  initialValues,
  onSuccess,
  onCancel,
}: OurTeamFormProps) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialValues?.imageUrl
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.imageUrl);
    } else {
      form.resetFields();
      setImageUrl(undefined);
    }
  }, [initialValues, form]);

  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageUrl(url);
        form.setFieldsValue({ imageUrl: url });
      });
    }
  };

  const onFinish = async (values: CreateOurTeamRequest) => {
    try {
      const payload = { ...values, imageUrl: imageUrl || "" };
      if (initialValues) {
        await ourTeamService.update(initialValues.id, payload);
      } else {
        await ourTeamService.create(payload);
      }
      onSuccess();
    } catch {
      message.error("Failed to save the team member");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="ourTeam" label="Our Team" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="ourTeamTitle" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="ourTeamDescription"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="viTri" label="Position" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="location" label="Location" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Image">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          customRequest={({ onSuccess }) => {
            if (onSuccess) {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            <UploadOutlined />
          )}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OurTeamForm;
