import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Upload, Image } from "antd";
import type { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import aboutUsService from "./aboutUs.service";
import type { AboutUs, CreateAboutUs } from "./aboutUs.type";

interface AboutUsFormProps {
  initialValues?: AboutUs;
  onSuccess?: () => void;
}

const AboutUsForm: React.FC<AboutUsFormProps> = ({
  initialValues,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialValues?.imageUrl
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.imageUrl) {
        setPreviewImage(initialValues.imageUrl);
      }
    } else {
      form.resetFields();
      setPreviewImage(undefined);
    }
  }, [initialValues, form]);

  const createMutation = useMutation({
    mutationFn: (aboutUs: CreateAboutUs) =>
      aboutUsService.createAboutUs(aboutUs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      onSuccess?.();
      form.resetFields();
      setFileList([]);
      setPreviewImage(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (aboutUs: Partial<CreateAboutUs>) =>
      aboutUsService.updateAboutUs(initialValues!.id, aboutUs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      onSuccess?.();
    },
  });

  const handleFinish = (values: CreateAboutUs) => {
    const aboutUsData = { ...values, imageUrl: previewImage || "" };
    if (initialValues) {
      updateMutation.mutate(aboutUsData);
    } else {
      createMutation.mutate(aboutUsData);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      // message.error('Image must smaller than 10MB!');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    return false; // Prevent auto-upload
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="companyName"
        label="Company Name"
        rules={[{ required: true, message: "Please input the company name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="companyTitle"
        label="Company Title"
        rules={[{ required: true, message: "Please input the company title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="companyDescription"
        label="Company Description"
        rules={[
          { required: true, message: "Please input the company description!" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="servicesSectionTitle"
        label="Services Section Title"
        rules={[
          {
            required: true,
            message: "Please input the services section title!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="servicesSectionDescription"
        label="Services Section Description"
        rules={[
          {
            required: true,
            message: "Please input the services section description!",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Image">
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onRemove={() => setPreviewImage(undefined)}
          maxCount={1}
        >
          {fileList.length < 1 && "+ Upload"}
        </Upload>
        {previewImage && <Image width={200} src={previewImage} />}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={createMutation.isPending || updateMutation.isPending}
        >
          {initialValues ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AboutUsForm;
