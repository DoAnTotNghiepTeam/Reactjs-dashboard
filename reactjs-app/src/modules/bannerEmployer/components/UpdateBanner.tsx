import { Modal, Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
import { useState, useEffect } from "react";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { updateBanner, uploadBannerImage } from "../banneremployer.service";
import type { BannerEmployer } from "../banneremployer.type";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthStore } from "../../../stores/useAuthorStore";
const { RangePicker } = DatePicker;

interface EditBannerProps {
  visible: boolean;
  onClose: () => void;
  banner: BannerEmployer;
}

export default function EditBanner({ visible, onClose, banner }: EditBannerProps) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(banner?.bannerImage || "");
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu file ảnh
  const [loading, setLoading] = useState(false);
  const [bannerType, setBannerType] = useState<string>(banner?.bannerType || "Vip");
  const [sizeHint, setSizeHint] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null); // State lưu thời gian thuê

  // Hàm lấy thông báo kích thước
  const getSizeHint = (type: string) => {
    if (type === "Vip") return "Ảnh Vip: chiều ngang ≤ 600px, chiều dọc ≤ 380px";
    if (type === "Featured") return "Ảnh Featured: chiều ngang ≤ 1100px, chiều dọc ≤ 105px";
    if (type === "Standard") return "Ảnh Standard: chiều ngang ≤ 900px, chiều dọc ≤ 900px";
    return "";
  };

  useEffect(() => {
    if (banner) {
      console.log("🔍 Banner data for edit:", banner); // Debug: xem dữ liệu banner
      const type = banner.bannerType || "Vip";
      setBannerType(type);
      setSizeHint(getSizeHint(type));
      
      // Lưu ngày tháng vào state để hiển thị trong RangePicker
      const dates = [
        banner.startDate ? dayjs(banner.startDate) : null, 
        banner.endDate ? dayjs(banner.endDate) : null
      ];
      setDateRange(dates);
      
      form.setFieldsValue({
        companyName: banner.companyName,
        companyEmail: banner.companyEmail,
        companyPhone: banner.companyPhone,
        bannerType: type,
        dateRange: dates,
      });
      setImageUrl(banner.bannerImage || "");
    }
  }, [banner, form]);

  const handleUpload = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    try {
      setImageFile(file as File); // Lưu file để gửi lên server
      const url = URL.createObjectURL(file as File); // Tạo URL preview
      setImageUrl(url);
      message.success("Chọn ảnh thành công!");
      if (onSuccess) onSuccess(url, {} as any);
    } catch (err) {
      message.error("Chọn ảnh thất bại!");
      if (onError) onError(err as any);
    }
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log("🔄 Form values:", values); // Debug: xem giá trị form
      const { access_token } = useAuthStore.getState();
      
      // Tạo FormData giống như trong Postman
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("companyEmail", values.companyEmail);
      formData.append("companyPhone", values.companyPhone || "");
      formData.append("bannerType", values.bannerType);
      formData.append("startDate", values.dateRange[0].format("YYYY-MM-DD"));
      formData.append("endDate", values.dateRange[1].format("YYYY-MM-DD"));
      
      // Nếu có chọn ảnh mới thì gửi file, không thì backend giữ ảnh cũ
      if (imageFile) {
        formData.append("bannerImage", imageFile);
      }
      
      await updateBanner(banner.id, formData, access_token ?? "");
      message.success("Cập nhật banner thành công!");
      onClose();
    } catch {
      message.error("Cập nhật banner thất bại!");
    }
    setLoading(false);
  };

  return (
    <Modal 
      open={visible} 
      onCancel={onClose} 
      footer={null} 
      title="Sửa thông tin banner" 
      width={600}
      centered
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="companyEmail" label="Email công ty" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
        <Form.Item name="bannerType" label="Vị trí" rules={[{ required: true }]}>
          <Select
            value={bannerType}
            onChange={(v) => {
              setBannerType(v);
              setSizeHint(getSizeHint(v));
              form.setFieldsValue({ bannerType: v });
            }}
          >
            <Select.Option value="Vip">VIP</Select.Option>
            <Select.Option value="Featured">Featured</Select.Option>
            <Select.Option value="Standard">Standard</Select.Option>
          </Select>
          {sizeHint && <div style={{ color: "#faad14", marginTop: 4, fontSize: "13px" }}>{sizeHint}</div>}
        </Form.Item>
        <Form.Item name="dateRange" label="Thời gian thuê" rules={[{ required: true }]}>
          <RangePicker 
            showTime 
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
              form.setFieldsValue({ dateRange: dates });
            }}
          />
          <div style={{ color: "#1890ff", marginTop: 4, fontSize: "13px" }}>
            📅 Your banner will be displayed at 00:00 on the selected start date after admin approval
          </div>
        </Form.Item>
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
