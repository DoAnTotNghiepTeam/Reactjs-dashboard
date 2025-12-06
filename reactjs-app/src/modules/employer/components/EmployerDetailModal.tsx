import React from "react";
import { Modal, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./EmployerDetailModal.css";

interface EmployerDetailModalProps {
  open: boolean;
  onCancel: () => void;
  employer: any | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const EmployerDetailModal: React.FC<EmployerDetailModalProps> = ({
  open,
  onCancel,
  employer,
  onApprove,
  onReject,
}) => {
  const info = employer?.companyInformation;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={750}
      title={
        <span className="employer-modal-title"></span>
      }
      className="employer-modal-root"
    >
      {info ? (
        <div className="employer-modal-content">
          {/* Banner + Avatar */}
          <div className="employer-modal-banner-wrap">
            <img
              src={info.bannerUrl || "/assets/static/default-banner.jpg"}
              alt="Banner"
              className="employer-modal-banner"
            />
            <div className="employer-modal-avatar-wrap">
              <img
                src={info.logoUrl || "/assets/static/default-avatar.png"}
                alt="Logo"
                className="employer-modal-avatar"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="employer-modal-info">
            <h2 className="employer-modal-company-name">
              {info.companyName}
            </h2>
            <div className="employer-modal-info-grid">
              <p className="employer-modal-info-row">
                <MailOutlined className="employer-modal-icon" />
                <span className="employer-modal-label">Email:</span>
                <span className="employer-modal-value">{info.email}</span>
              </p>
              <p className="employer-modal-info-row">
                <PhoneOutlined className="employer-modal-icon" />
                <span className="employer-modal-label">Phone:</span>
                <span className="employer-modal-value">{info.phone}</span>
              </p>
              <p className="employer-modal-info-row">
                <EnvironmentOutlined className="employer-modal-icon" />
                <span className="employer-modal-label">Address:</span>
                <span className="employer-modal-value">{info.address}</span>
              </p>
              <p className="employer-modal-info-row">
                <GlobalOutlined className="employer-modal-icon" />
                <span className="employer-modal-label">Website:</span>
                <a
                  href={info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="employer-modal-link"
                >
                  {info.website}
                </a>
              </p>
              <p className="employer-modal-info-row">
                <span className="employer-modal-label">Industry:</span> {info.industry}
              </p>
              <p className="employer-modal-info-row">
                <TeamOutlined className="employer-modal-icon" />
                <span className="employer-modal-label">Company Size:</span>
                <span className="employer-modal-value">{info.minEmployees} - {info.maxEmployees}</span>
              </p>
            </div>
            <div className="employer-modal-desc-wrap">
              <span className="employer-modal-desc-label">Description:</span>
              <p className="employer-modal-desc">{info.description}</p>
            </div>
            <div className="employer-modal-status-wrap">
              <span className="employer-modal-status-label">Status:</span>
              <span
                className={`employer-modal-status-badge ${
                  info.status === "APPROVED"
                    ? "employer-modal-status-approved"
                    : info.status === "PENDING"
                    ? "employer-modal-status-pending"
                    : "employer-modal-status-rejected"
                }`}
              >
                {info.status}
              </span>
            </div>
            {/* BUTTONS */}
            <div className="employer-modal-btn-group">
              <Button
                onClick={() => {
                  if (onReject) onReject();
                }}
                danger
                className="employer-modal-btn-reject"
              >
                Reject
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (onApprove) onApprove();
                }}
                className="employer-modal-btn-approve"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="employer-modal-empty">No company information.</p>
      )}
    </Modal>
  );
};

export default EmployerDetailModal;