
import { useEffect, useState } from "react";
import { fetchCompanys, fetchSearchCompanys } from "../company.service";
import { InboxOutlined } from "@ant-design/icons";
import { Spin, Pagination, Input } from "antd";
import CompanyDetailModal from "./CompanyDetailModal";
import "./ListCompanys.css";

const ListCompanys = () => {
  const [companys, setCompanys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

    const loadData = (pageNum: number = 1, searchValue: string = "") => {
        setLoading(true);
        const pageIndex = Math.max(pageNum - 1, 0);
        if (searchValue.trim()) {
            fetchSearchCompanys(searchValue, pageIndex).then((data) => {
                setCompanys(Array.isArray(data?.data) ? data.data : []);
                setTotal(data.totalRecords || 0);
                setPageSize(data.pageSize || 10);
            }).finally(() => setLoading(false));
        } else {
            fetchCompanys(pageIndex).then((data) => {
                setCompanys(Array.isArray(data?.data) ? data.data : []);
                setTotal(data.totalRecords || 0);
                setPageSize(data.pageSize || 10);
            }).finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        loadData(page, search);
    }, [page, search]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Chỉ cập nhật search khi nhấn nút search hoặc enter
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
      <div className="companys-page-root">
        <div className="companys-header-row">
          <h1 className="companys-title">Company Management</h1>
          {/* <div className="companys-search-box">
            <Input.Search
              placeholder="Search company name..."
              allowClear
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onSearch={handleSearch}
              enterButton
            />
          </div> */}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Spin size="large" />
          </div>
        ) : companys.length === 0 ? (
          <div className="companys-empty">
            <InboxOutlined className="companys-empty-icon" />
            <p>No companies found</p>
          </div>
        ) : (
          <div>
            <div className="companys-grid">
              {companys.map((comp) => (
                <div
                  key={comp.id}
                  className="company-card"
                  onClick={() => {
                    setSelectedCompany(comp);
                    setModalOpen(true);
                  }}
                  style={{ cursor: "pointer" }}
                  title="View company details"
                >
                  <div className="company-card-header">
                    <div className="company-logo">
                      {comp.logoUrl ? (
                        <img src={comp.logoUrl} alt="Logo" />
                      ) : (
                        <img src="https://via.placeholder.com/40x40?text=Logo" alt="Default Logo" />
                      )}
                    </div>
                    <div>
                      <h3 className="company-name">{comp.companyName || "No company name"}</h3>
                      <p className="industry">{comp.industry || "Unknown industry"}</p>
                    </div>
                  </div>
                  <p className="employee-count">
                    {comp.minEmployees ? `${comp.minEmployees}+ employees` : "Unknown size"}
                  </p>
                  <div className="location">
                    <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {comp.location || "Unknown location"}
                  </div>
                  <div className="status">
                    {comp.status === "APPROVED" && (
                      <span className="badge approved">Approved</span>
                    )}
                    {comp.status === "PENDING" && (
                      <span className="badge pending">Pending</span>
                    )}
                    {comp.status === "REJECTED" && (
                      <span className="badge rejected">Rejected</span>
                    )}
                  </div>
                  <p className="contact">Contact: {comp.email || "No contact"}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
            <CompanyDetailModal
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              company={selectedCompany}
            />
          </div>
        )}
      </div>
    );
}
export default ListCompanys;