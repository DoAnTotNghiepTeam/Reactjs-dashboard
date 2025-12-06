import React from "react";
import { Modal, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./CompanyDetailModal.css";

interface CompanyDetailModalProps {
  open: boolean;
  onCancel: () => void;
  company: any | null;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ open, onCancel, company }) => {
  if (!company) return null;
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={750}
      title={<span className="company-modal-title">Company Information</span>}
      className="company-modal-root"
    >
      <div className="company-modal-content">
        <div className="company-modal-banner-wrap">
          <img
            src={company.bannerUrl || "/assets/static/default-banner.jpg"}
            alt="Banner"
            className="company-modal-banner"
          />
          <div className="company-modal-avatar-wrap">
            <img
              src={company.logoUrl || "/assets/static/default-avatar.png"}
              alt="Logo"
              className="company-modal-avatar"
            />
          </div>
        </div>
        <div className="company-modal-info">
          <h2 className="company-modal-company-name">{company.companyName}</h2>
          <div className="company-modal-info-grid">
            <p className="company-modal-info-row">
              <MailOutlined className="company-modal-icon" />
              <span className="company-modal-label">Email:</span>
              <span className="company-modal-value">{company.email}</span>
            </p>
            <p className="company-modal-info-row">
              <PhoneOutlined className="company-modal-icon" />
              <span className="company-modal-label">Phone:</span>
              <span className="company-modal-value">{company.phone}</span>
            </p>
            <p className="company-modal-info-row">
              <EnvironmentOutlined className="company-modal-icon" />
              <span className="company-modal-label">Address:</span>
              <span className="company-modal-value">{company.address}</span>
            </p>
            <p className="company-modal-info-row">
              <GlobalOutlined className="company-modal-icon" />
              <span className="company-modal-label">Website:</span>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="company-modal-link"
              >
                {company.website}
              </a>
            </p>
            <p className="company-modal-info-row">
              <span className="company-modal-label">Industry:</span> {company.industry}
            </p>
            <p className="company-modal-info-row">
              <TeamOutlined className="company-modal-icon" />
              <span className="company-modal-label">Company Size:</span>
              <span className="company-modal-value">{company.minEmployees} - {company.maxEmployees}</span>
            </p>
          </div>
          <div className="company-modal-desc-wrap">
            <span className="company-modal-desc-label">Description:</span>
            <p className="company-modal-desc">{company.description}</p>
          </div>
          <div className="company-modal-status-wrap">
            <span className="company-modal-status-label">Status:</span>
            <span
              className={`company-modal-status-badge ${
                company.status === "APPROVED"
                  ? "company-modal-status-approved"
                  : company.status === "PENDING"
                  ? "company-modal-status-pending"
                  : "company-modal-status-rejected"
              }`}
            >
              {company.status}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyDetailModal;
