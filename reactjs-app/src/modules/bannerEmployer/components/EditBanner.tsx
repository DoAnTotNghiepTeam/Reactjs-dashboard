import { Modal, Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
import { useState, useEffect } from "react";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { updateBanner, uploadBannerImage } from "../banneremployer.service";
import type { BannerEmployer } from "../banneremployer.type";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

interface EditBannerProps {
  visible: boolean;
  onClose: () => void;
  banner: BannerEmployer;
}

export default function EditBanner({ visible, onClose, banner }: EditBannerProps) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(banner?.bannerImage || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        ...banner,
        dateRange: [banner.startDate ? dayjs(banner.startDate) : null, banner.endDate ? dayjs(banner.endDate) : null],
      });
      setImageUrl(banner.bannerImage || "");
    }
  }, [banner, form]);

  const handleUpload = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadBannerImage(file as File);
      setImageUrl(url);
      message.success("Upload ảnh thành công!");
      if (onSuccess) onSuccess(url, {} as any);
    } catch (err) {
      message.error("Upload ảnh thất bại!");
      if (onError) onError(err as any);
    }
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateBanner(banner.id, {
        ...values,
        bannerImage: imageUrl,
        startDate: values.dateRange[0].format("YYYY-MM-DDTHH:mm:ss"),
        endDate: values.dateRange[1].format("YYYY-MM-DDTHH:mm:ss"),
        userId: banner.userId,
      });
      message.success("Cập nhật banner thành công!");
      onClose();
    } catch {
      message.error("Cập nhật banner thất bại!");
    }
    setLoading(false);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Sửa thông tin banner" width={600}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="companyEmail" label="Email công ty" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
        <Form.Item name="companyPhone" label="Số điện thoại công ty" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="companyWebsite" label="Website công ty"><Input /></Form.Item>
        <Form.Item name="bannerTitle" label="Tiêu đề banner" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="position" label="Vị trí" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="home_hero">VIP</Select.Option>
            <Select.Option value="featured">Featured</Select.Option>
            <Select.Option value="standard">Standard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="bannerLink" label="Link banner" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="dateRange" label="Thời gian thuê" rules={[{ required: true }]}><RangePicker showTime /></Form.Item>
        <Form.Item label="Ảnh banner/logo">
          <Upload name="file" customRequest={handleUpload} showUploadList={false} accept="image/*">
            <Button icon={<UploadOutlined />}>Upload ảnh</Button>
          </Upload>
          {imageUrl && <img src={imageUrl} alt="banner" style={{ marginTop: 8, maxWidth: "100%", maxHeight: 80, borderRadius: 6 }} />}
        </Form.Item>
        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>Lưu thay đổi</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
