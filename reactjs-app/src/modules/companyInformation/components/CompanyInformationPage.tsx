import React, { useEffect, useState } from "react";
import { Button, Input, Spin, message, Upload } from "antd";
import {
MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./CompanyInformation.css";
import { useAuthStore } from "../../../stores/useAuthorStore";

interface CompanyInfo {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  industry: string;
  minEmployees: number;
  maxEmployees: number;
  description: string;
  status: string;
  bannerUrl?: string;
  logoUrl?: string;
}

const CompanyInformationPage: React.FC = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Partial<CompanyInfo>>({});
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Lấy id đăng nhập từ store
  const loggedInUser = useAuthStore((state) => state.loggedInUser);
  const employerId = loggedInUser?.id;

  useEffect(() => {
    if (employerId) fetchData();
    // eslint-disable-next-line
  }, [employerId]);

  useEffect(() => {
    if (info) {
      setBannerPreview(info.bannerUrl);
      setLogoPreview(info.logoUrl);
    }
  }, [info]);

  const fetchData = async () => {
    if (!employerId) return;
    setLoading(true);
    try {
      // Lấy thông tin công ty theo id đăng nhập
      const res = await fetch(`http://localhost:8080/api/company/employer/${employerId}`);
      if (!res.ok) throw new Error("Không thể lấy thông tin công ty");
      const data = await res.json();
      setInfo(data);
      setForm(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message || "Lỗi khi tải dữ liệu");
      } else {
        message.error("Lỗi khi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyInfo, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Chuyển file sang base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let bannerBase64 = form.bannerUrl;
      let logoBase64 = form.logoUrl;

      // Convert banner to base64 if changed
      if (bannerFile) {
        bannerBase64 = await fileToBase64(bannerFile);
      }
      // Convert logo to base64 if changed
      if (logoFile) {
        logoBase64 = await fileToBase64(logoFile);
      }

      // Gửi thông tin công ty (bao gồm base64 ảnh nếu có) bằng API mới
      const res = await fetch(`http://localhost:8080/api/company/${employerId}/update-company-info`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bannerUrl: bannerBase64, logoUrl: logoBase64 }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      message.success("Cập nhật thành công");
      setEdit(false);
      setBannerFile(null);
      setLogoFile(null);
      fetchData();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message || "Lỗi khi cập nhật");
      } else {
        message.error("Lỗi khi cập nhật");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem 0" }}><Spin size="large" /></div>;
  }

  if (!info) {
    return <div className="company-info-empty">No company information</div>;
  }

  return (
    <div className="company-info-page-root">
      <div className="company-info-banner-wrap">
        {edit ? (
          <div style={{ position: "relative" }}>
            <Upload
              showUploadList={false}
              beforeUpload={file => {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
                return false;
              }}
              accept="image/*"
            >
              <img
                src={bannerPreview || "/assets/static/default-banner.jpg"}
                alt="Banner"
                className="company-info-banner"
                style={{ cursor: "pointer", opacity: 0.9 }}
                title="Chỉnh sửa banner"
              />
              <Button style={{ position: "absolute", right: 16, bottom: 16, zIndex: 2 }}>
                Update banner
              </Button>
            </Upload>
          </div>
        ) : (
          <img
            src={info.bannerUrl || "/assets/static/default-banner.jpg"}
            alt="Banner"
            className="company-info-banner"
          />
        )}
        <div className="company-info-avatar-wrap">
          {edit ? (
            <Upload
              showUploadList={false}
              beforeUpload={file => {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
                return false;
              }}
              accept="image/*"
            >
              <img
                src={logoPreview || "/assets/static/default-avatar.png"}
                alt="Logo"
                className="company-info-avatar"
                style={{ cursor: "pointer", opacity: 0.95 }}
                title="Chỉnh sửa logo"
              />
              <Button size="small" style={{ position: "absolute", left: 0, bottom: -36, zIndex: 2 }}>
                Update logo
              </Button>
            </Upload>
          ) : (
            <img
              src={info.logoUrl || "/assets/static/default-avatar.png"}
              alt="Logo"
              className="company-info-avatar"
            />
          )}
        </div>
      </div>
      <div className="company-info-content">
        <h2 className="company-info-company-name">
          {edit ? (
            <Input
              value={form.companyName}
              onChange={e => handleChange("companyName", e.target.value)}
              style={{ fontWeight: 700, fontSize: 24 }}
            />
          ) : (
            info.companyName
          )}
        </h2>
        <div className="company-info-info-grid">
          <p className="company-info-info-row">
            <MailOutlined className="company-info-icon" />
            <span className="company-info-label">Email:</span>
            {edit ? (
              <Input
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span className="company-info-value">{info.email}</span>
            )}
          </p>
          <p className="company-info-info-row">
            <PhoneOutlined className="company-info-icon" />
            <span className="company-info-label">Phone:</span>
            {edit ? (
              <Input
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span className="company-info-value">{info.phone}</span>
            )}
          </p>
          <p className="company-info-info-row">
            <EnvironmentOutlined className="company-info-icon" />
            <span className="company-info-label">Address:</span>
            {edit ? (
              <Input
                value={form.address}
                onChange={e => handleChange("address", e.target.value)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span className="company-info-value">{info.address}</span>
            )}
          </p>
          <p className="company-info-info-row">
            <GlobalOutlined className="company-info-icon" />
            <span className="company-info-label">Website:</span>
            {edit ? (
              <Input
                value={form.website}
                onChange={e => handleChange("website", e.target.value)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            ) : (
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="company-info-link"
              >
                {info.website}
              </a>
            )}
          </p>
          <p className="company-info-info-row">
            <span className="company-info-label">Industry:</span>
            {edit ? (
              <Input
                value={form.industry}
                onChange={e => handleChange("industry", e.target.value)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            ) : (
              info.industry
            )}
          </p>
          <p className="company-info-info-row">
            <TeamOutlined className="company-info-icon" />
            <span className="company-info-label">Employee Range:</span>
            {edit ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
                <Input
                  value={form.minEmployees}
                  onChange={e => handleChange("minEmployees", e.target.value)}
                  size="small"
                  style={{ width: 60 }}
                  type="number"
                />
                <span>-</span>
                <Input
                  value={form.maxEmployees}
                  onChange={e => handleChange("maxEmployees", e.target.value)}
                  size="small"
                  style={{ width: 60 }}
                  type="number"
                />
              </span>
            ) : (
              <span className="company-info-value">{info.minEmployees} - {info.maxEmployees}</span>
            )}
          </p>
        </div>
        <div className="company-info-desc-wrap">
          <span className="company-info-desc-label">Description:</span>
          {edit ? (
            <Input.TextArea
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              autoSize={{ minRows: 3 }}
              style={{ background: "#f9fafb" }}
            />
          ) : (
            <p className="company-info-desc">{info.description}</p>
          )}
        </div>
        <div className="company-info-status-wrap">
          <span className="company-info-status-label">Status:</span>
          <span
            className={`company-info-status-badge ${
              info.status === "APPROVED"
                ? "company-info-status-approved"
                : info.status === "PENDING"
                ? "company-info-status-pending"
                : "company-info-status-rejected"
            }`}
          >
            {info.status}
          </span>
        </div>
        <div className="company-info-btn-group">
          {edit ? (
            <>
              <Button onClick={() => setEdit(false)} className="company-info-btn-reject">Cancel</Button>
              <Button type="primary" onClick={handleSave} className="company-info-btn-approve">Save</Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setEdit(true)} className="company-info-btn-approve">Update</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInformationPage;
