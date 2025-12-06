import { useEffect, useState } from "react";
import { fetchUpgradeEmployers, approveEmployer, rejectEmployer } from "../employer.service";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import { notification } from "antd";
import EmployerDetailModal from "./EmployerDetailModal";

const ListEmployerTable = () => {
  const [employers, setEmployers] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const loadData = () => {
    fetchUpgradeEmployers().then((data) => {
      setEmployers(Array.isArray(data?.data) ? data.data : []);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShowDetail = (employer: any) => {
    setSelectedEmployer(employer);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployer(null);
  };

  const handleApprove = async () => {
    try {
      await approveEmployer(selectedEmployer.id);
      notification.success({ message: "Phê duyệt thành công!" });
      handleCloseModal();
      loadData();
    } catch {
      notification.error({ message: "Phê duyệt thất bại!" });
    }
  };

  const handleReject = async () => {
    try {
      await rejectEmployer(selectedEmployer.id);
      notification.success({ message: "Từ chối thành công!" });
      handleCloseModal();
      loadData();
    } catch {
      notification.error({ message: "Từ chối thất bại!" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style>{`
        .employer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .employer-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 10px;
        }
        .employer-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        .employer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .employer-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .employer-logo img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }
        .company-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .industry,
        .employee-count,
        .contact {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0;
        }
        .location {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #4b5563;
          margin: 6px 0;
        }
        .location .icon {
          width: 16px;
          height: 16px;
          margin-right: 6px;
          color: #9ca3af;
        }
        .status {
          margin: 8px 0;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
        }
        .badge.approved {
          background: #d1fae5;
          color: #059669;
        }
        .badge.pending {
          background: #fef3c7;
          color: #d97706;
        }
        .badge.rejected {
          background: #fee2e2;
          color: #dc2626;
        }
      `}</style>

      {/* Header */}
      <div className="mb-10 flex items-center justify-between" style={{ marginBottom: 40 }}>
        <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
        <div className="flex items-center text-sm text-gray-500">
          <UserOutlined className="mr-1" />
          <span>Admin</span>
          <span className="mx-2">{">"}</span>
          <span>Employer Management</span>
        </div>
      </div>

      {/* Grid employers */}
      {employers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-lg shadow-sm">
          <InboxOutlined className="text-4xl mb-2" />
          <p>Không có employer nào cần phê duyệt</p>
        </div>
      ) : (
        <div className="employer-grid">
          {employers.map((emp) => (
            <div
              key={emp.id}
              onClick={() => handleShowDetail(emp)}
              className="employer-card"
            >
              <div className="employer-header">
                <div className="employer-logo">
                  {emp.companyInformation?.logoUrl ? (
                    <img src={emp.companyInformation.logoUrl} alt="Company Logo" />
                  ) : (
                    <img src="https://via.placeholder.com/40x40?text=Logo" alt="Default Logo" />
                  )}
                </div>
                <div>
                  <h3 className="company-name">
                    {emp.companyInformation?.companyName || "Chưa có tên công ty"}
                  </h3>
                  <p className="industry">
                    {emp.companyInformation?.industry || "Ngành nghề chưa rõ"}
                  </p>
                </div>
              </div>

              <p className="employee-count">
                {emp.companyInformation?.minEmployees
                  ? `${emp.companyInformation.minEmployees}+ employees`
                  : "Quy mô chưa rõ"}
              </p>

              <div className="location">
                <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {emp.companyInformation?.location || "Chưa rõ địa điểm"}
              </div>

              <div className="status">
                {emp.companyInformation?.status === "APPROVED" && (
                  <span className="badge approved">Approved</span>
                )}
                {emp.companyInformation?.status === "PENDING" && (
                  <span className="badge pending">Pending</span>
                )}
                {emp.companyInformation?.status === "REJECTED" && (
                  <span className="badge rejected">Rejected</span>
                )}
              </div>

              <p className="contact">
                Contact: {emp.fullName || "Chưa có"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <EmployerDetailModal
        open={isModalVisible}
        onCancel={handleCloseModal}
        employer={selectedEmployer}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ListEmployerTable;
