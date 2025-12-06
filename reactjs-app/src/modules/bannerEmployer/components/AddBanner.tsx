import { Modal, Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { createBanner } from "../banneremployer.service";
import { useAuthStore } from "../../../stores/useAuthorStore";

const { RangePicker } = DatePicker;

interface AddBannerProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
}

export default function AddBanner({ visible, onClose }: AddBannerProps) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [bannerType, setBannerType] = useState<string>("Vip");
  const [sizeHint, setSizeHint] = useState<string>(
    "Ảnh Vip: chiều ngang ≤ 600px, chiều dọc ≤ 380px"
  );
  const bannerPrices: Record<string, number> = {
    Vip: 3,
    Featured: 2,
    Standard: 1,
  };
  const [dateRange, setDateRange] = useState<any>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Config message
  message.config({
    top: 60,
    duration: 3,
    maxCount: 2,
  });

  // Thông báo kích thước động
  const getSizeHint = (type: string) => {
    if (type === "Vip") return "Ảnh Vip: chiều ngang ≤ 600px, chiều dọc ≤ 380px";
    if (type === "Featured") return "Ảnh Featured: chiều ngang ≤ 1100px, chiều dọc ≤ 105px";
    if (type === "Standard") return "Ảnh Standard: chiều ngang ≤ 900px, chiều dọc ≤ 900px";
    return "";
  };

  const handleUpload = async (options: UploadRequestOption) => {
    const { file: uploadFile, onSuccess, onError } = options;
    try {
      const img = new window.Image();
      img.src = URL.createObjectURL(uploadFile as File);
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        let valid = false;
        let errMsg = "";

        if (bannerType === "Vip") {
          valid = img.width <= 600 && img.height <= 380;
          if (!valid)
            errMsg = `Ảnh Vip phải ≤ 600x380. Ảnh bạn chọn: ${img.width}x${img.height}`;
        } else if (bannerType === "Featured") {
          valid = img.width <= 1100 && img.height <= 105;
          if (!valid)
            errMsg = `Ảnh Featured phải ≤ 1100x105. Ảnh bạn chọn: ${img.width}x${img.height}`;
        } else if (bannerType === "Standard") {
          valid = img.width <= 900 && img.height <= 900;
          if (!valid)
            errMsg = `Ảnh Standard phải ≤ 900x900. Ảnh bạn chọn: ${img.width}x${img.height}`;
        } else {
          valid = true;
        }

        if (!valid) {
          message.error(errMsg);
          onError?.(new Error(errMsg));
          setFile(null);
          setImageUrl("");
          return;
        }

        setFile(uploadFile as File);
        setImageUrl(img.src);
        message.success("Chọn ảnh thành công!");
        onSuccess?.(img.src, {} as any);
      };
      img.onerror = () => {
        message.error("Không đọc được ảnh!");
        onError?.(new Error("Không đọc được ảnh!"));
      };
    } catch (err) {
      message.error("Chọn ảnh thất bại!");
      onError?.(err as any);
    }
  };

  const handleFinish = async (values: any) => {
    if (!file) {
      message.error("Vui lòng chọn ảnh banner/logo!");
      return;
    }

    if (imageSize) {
      let valid = false;
      let errMsg = "";

      if (bannerType === "Vip") {
        valid = imageSize.width <= 600 && imageSize.height <= 380;
        if (!valid)
          errMsg = `Ảnh Vip phải ≤ 600x380. Ảnh bạn chọn: ${imageSize.width}x${imageSize.height}`;
      } else if (bannerType === "Featured") {
        valid = imageSize.width <= 1100 && imageSize.height <= 105;
        if (!valid)
          errMsg = `Ảnh Featured phải ≤ 1100x105. Ảnh bạn chọn: ${imageSize.width}x${imageSize.height}`;
      } else if (bannerType === "Standard") {
        valid = imageSize.width <= 900 && imageSize.height <= 900;
        if (!valid)
          errMsg = `Ảnh Standard phải ≤ 900x900. Ảnh bạn chọn: ${imageSize.width}x${imageSize.height}`;
      } else {
        valid = true;
      }

      if (!valid) {
        message.error(errMsg);
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("companyEmail", values.companyEmail);
      formData.append("companyPhone", values.companyPhone);
      formData.append("bannerType", values.bannerType);
      formData.append("startDate", values.dateRange[0].format("YYYY-MM-DD"));
      formData.append("endDate", values.dateRange[1].format("YYYY-MM-DD"));
      formData.append("description", values.description || "");
      if (file) formData.append("bannerImage", file);

      const { access_token } = useAuthStore.getState();
  await createBanner(formData, access_token ?? "");
  toast.success("Tạo banner thành công!");
  onClose();
  form.resetFields();
  setImageUrl("");
  setFile(null);
  setImageSize(null);
  setBannerType("Vip");
  setSizeHint(getSizeHint("Vip"));
    } catch (err: any) {
      let errorMsg = "Tạo banner thất bại!";
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Tạo banner mới" width={600} centered>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ bannerType: "Vip" }}
      >
        <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="companyEmail" label="Email công ty" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="companyPhone" label="Số điện thoại công ty" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="bannerType"
          label="Loại banner"
          rules={[{ required: true, message: "Vui lòng chọn loại banner!" }]}
        >
          <Select
            value={bannerType}
            onChange={(v) => {
              setBannerType(v);
              setSizeHint(getSizeHint(v));
              form.setFieldsValue({ bannerType: v });
            }}
          >
            <Select.Option value="Vip">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Vip</span>
                <span style={{ color: "red", fontWeight: 500 }}>$3</span>
              </div>
            </Select.Option>
            <Select.Option value="Featured">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Featured</span>
                <span style={{ color: "green", fontWeight: 500 }}>$2</span>
              </div>
            </Select.Option>
            <Select.Option value="Standard">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Standard</span>
                <span style={{ color: "#1890ff", fontWeight: 500 }}>$1</span>
              </div>
            </Select.Option>
          </Select>
          {sizeHint && <div style={{ color: "#faad14", marginTop: 4 }}>{sizeHint}</div>}
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Thời gian thuê"
          rules={[{ required: true }]}
        >
          <RangePicker
            showTime
            disabledDate={(current) => current && current.isBefore(new Date(), "day")}
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
              form.setFieldsValue({ dateRange: dates });
            }}
          />
        </Form.Item>

        <Form.Item label="Ảnh banner/logo" required>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Upload
                name="file"
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </div>
            <div style={{ color: "#52c41a", fontWeight: 600, fontSize: 20, marginRight: 30 }}>
              Tổng phí: {
                (() => {
                  if (!dateRange || !dateRange[0] || !dateRange[1]) return "$0";
                  const start = dateRange[0];
                  const end = dateRange[1];
                  const days = end.diff(start, "day") + 1;
                  const price = bannerPrices[bannerType] * days;
                  return `$${price}`;
                })()
              }
            </div>
          </div>
          {imageUrl && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, color: "#555" }}>Preview ảnh đã chọn:</div>
              <img
                src={imageUrl}
                alt="banner preview"
                style={{ marginTop: 4, maxWidth: "100%", maxHeight: 120, borderRadius: 6 }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo banner
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
