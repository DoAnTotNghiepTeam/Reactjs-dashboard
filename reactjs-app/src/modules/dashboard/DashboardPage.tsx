import  { useEffect, useState } from "react";
import axios from "axios";
import { Line, Column, Pie } from "@ant-design/plots";
import { Card, Row, Col, Typography } from "antd";
import { useAuthStore } from "../../stores/useAuthorStore";

const { Title, Text } = Typography;

const DashboardPage = () => {
  // Lấy thông tin user đã đăng nhập chỉ cho role Admin và Employer 
  const loggedInUser = useAuthStore((state) => state.loggedInUser);
  const isAdmin = loggedInUser?.roles?.includes("Administrators"); // Sửa từ "ADMIN" thành "Administrators"
  const isEmployer = loggedInUser?.roles?.includes("Employers"); // Sửa từ "EMPLOYER" thành "Employers"

  // Debug: Log thông tin user
  // useEffect(() => {
  //   console.log("Dashboard - loggedInUser:", loggedInUser);
  //   console.log("Dashboard - loggedInUser.roles:", loggedInUser?.roles);
  //   console.log("Dashboard - isAdmin:", isAdmin);
  //   console.log("Dashboard - isEmployer:", isEmployer);
  // }, [loggedInUser, isAdmin, isEmployer]);

  // State cho thống kê admin
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalCandidates: 0,
    totalJobPostings: 0,
    totalApplications: 0,
  });

  // State cho thống kê employer
  const [employerStats, setEmployerStats] = useState({
    totalJobPostings: 0,
    totalApplicants: 0,
    acceptedApplicants: 0,
    rejectedApplicants: 0,
  });

  // vẽ biểu đồ colum và line set dlieu ban đầu là rỗng 
  const [chartData, setChartData] = useState({
    userGrowth: [],
    jobPosting: [],
    applicationStats: {
      applyRate: 0,
      totalApplications: 0,
    },
  });

  // State cho biểu đồ employer
  const [employerChartData, setEmployerChartData] = useState({
    jobPostingGrowth: [],
    applicantStats: [],
  });

  // Hàm chuẩn hóa dữ liệu chỉ hiển thị đến tháng hiện tại
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth(); // 0-based

  // Chuẩn hóa month từ API về dạng "Jan", "Feb", ...
  function normalizeMonth(raw: string | number | null | undefined) {
    if (!raw) return null;
    if (typeof raw === "number" || /^\d+$/.test(String(raw))) {
      const idx = Number(raw) - 1;
      return MONTHS[idx] || null;
    }
    const s = String(raw).trim();
    const three = s.slice(0, 3).toLowerCase();
    return three.charAt(0).toUpperCase() + three.slice(1);
  }

  // Fill dữ liệu từ Jan đến tháng hiện tại
  function fillMonthsToCurrent(
    data: Array<{ month: string | number | null | undefined; [key: string]: any }> | undefined,
    valueKey = "value"
  ) {
    const map = new Map();
    (data || []).forEach(item => {
      const m = normalizeMonth(item.month);
      if (!m) return;
      const v = Number(item[valueKey]);
      map.set(m, Number.isFinite(v) ? v : 0);
    });
    return MONTHS.slice(0, currentMonthIdx + 1).map(month => ({
      month,
      value: map.get(month) || 0,
    }));
  }

  // Lấy dữ liệu từ api overview
  useEffect(() => {
    if (isAdmin) {
      console.log("Fetching admin overview...");
      axios.get("http://localhost:8080/api/statistics/overview")
        .then(res => {
          console.log("Admin overview response:", res.data);
          setStats(res.data);
        })
        .catch(err => console.error("Error fetching overview:", err));
    } else if (isEmployer && loggedInUser?.id) {
      const employerId = loggedInUser.id;
      console.log("Fetching employer overview for ID:", employerId);
      // API thống kê cho employer
      axios.get(`http://localhost:8080/api/statistics/employer/${employerId}/overview`)
        .then(res => {
          console.log("Employer overview response:", res.data);
          setEmployerStats(res.data);
        })
        .catch(err => {
          console.error("Error fetching employer overview:", err);
          console.error("Error details:", err.response?.data);
        });
    } else {
      console.log("No fetch - isAdmin:", isAdmin, "isEmployer:", isEmployer, "userId:", loggedInUser?.id);
    }
  }, [isAdmin, isEmployer, loggedInUser?.id]);

  // Lấy dữ liệu từ api chart
  useEffect(() => {
    const year = new Date().getFullYear();
    if (isAdmin) {
      console.log("Fetching admin chart data...");
      axios.get(`http://localhost:8080/api/statistics/chart-data?year=${year}`)
        .then(res => {
          console.log("Admin chart data response:", res.data);
          setChartData({
            userGrowth: res.data.userGrowth || [],
            jobPosting: res.data.jobPosting || [],
            applicationStats: res.data.applicationStats || { applyRate: 0, totalApplications: 0 },
          });
        })
        .catch(err => console.error("Error fetching chart-data:", err));
    } else if (isEmployer && loggedInUser?.id) {
      const employerId = loggedInUser.id;
      console.log("Fetching employer chart data for ID:", employerId, "year:", year);
      // API biểu đồ cho employer
      axios.get(`http://localhost:8080/api/statistics/employer/${employerId}/chart-data?year=${year}`)
        .then(res => {
          console.log("Employer chart data response:", res.data);
          setEmployerChartData({
            jobPostingGrowth: res.data.jobPostingGrowth || [],
            applicantStats: res.data.applicantStats || [],
          });
        })
        .catch(err => {
          console.error("Error fetching employer chart-data:", err);
          console.error("Error details:", err.response?.data);
        });
    } else {
      console.log("No chart fetch - isAdmin:", isAdmin, "isEmployer:", isEmployer, "userId:", loggedInUser?.id);
    }
  }, [isAdmin, isEmployer, loggedInUser?.id]);

  // Chuẩn hóa dữ liệu cho chart
  const userGrowthData = fillMonthsToCurrent(chartData.userGrowth);
  const jobPostingData = fillMonthsToCurrent(chartData.jobPosting);
  
  // Chuẩn hóa dữ liệu cho employer chart
  const employerJobGrowthData = fillMonthsToCurrent(employerChartData.jobPostingGrowth);
  const employerApplicantData = fillMonthsToCurrent(employerChartData.applicantStats);

  // dữ liệu mẫu cho CV (giữ nguyên)
  const cvSubmittedData = [
    { month: "Jul", value: 120 },
    { month: "Aug", value: 180 },
    { month: "Sep", value: 220 },
    { month: "Oct", value: 260 },
    { month: "Nov", value: 310 },
    { month: "Dec", value: 370 },
  ];

  // Apply Rate & Total Applications từ API mới
  const applyRate = Math.round((chartData.applicationStats.applyRate || 0) * 100); // chuyển sang %
  const totalApplications = chartData.applicationStats.totalApplications || 0;
  const applyPieData = [
    { type: "Applied", value: applyRate },
    { type: "Not Applied", value: 100 - applyRate },
  ];

  // Config charts 
  const userGrowthConfig = {
    data: userGrowthData,
    xField: "month",
    yField: "value",
    smooth: true,
    point: { size: 4 },
    height: 200,
  };
  const jobPostingConfig = {
    data: jobPostingData,
    xField: "month",
    yField: "value",
    columnStyle: { radius: [4, 4, 0, 0] },
    height: 200,
  };
  const cvSubmittedConfig = {
    data: cvSubmittedData,
    xField: "month",
    yField: "value",
    columnStyle: { radius: [4, 4, 0, 0] },
    color: "#48C9B0",
    height: 200,
  };
  const applyPieConfig = {
    data: applyPieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ value }: { value: number }) => `${value}%`,
      style: { fontSize: 14, fontWeight: 600 },
    },
    height: 160,
  };

  // Giao diện các thẻ thống kê ngang
  const statCards = [
    { title: "Users", value: stats.totalUsers, icon: "👤", color: "#4F8AFF" },
    { title: "Employers", value: stats.totalEmployers, icon: "🏢", color: "#6DD400" },
    // { title: "Candidates", value: stats.totalCandidates, icon: "🧑‍💼", color: "#FFC542" },
    { title: "Job Postings", value: stats.totalJobPostings, icon: "📄", color: "#FF6B6B" },
    { title: "Applications", value: stats.totalApplications, icon: "📨", color: "#9B8AFC" },
  ];

  // Giao diện các thẻ thống kê cho employer
  const employerStatCards = [
    { title: "Job Postings", value: employerStats.totalJobPostings, icon: "📄", color: "#4F8AFF" },
    { title: "Total Applicants", value: employerStats.totalApplicants, icon: "👥", color: "#6DD400" },
    { title: "Accepted", value: employerStats.acceptedApplicants, icon: "✅", color: "#48C9B0" },
    { title: "Rejected", value: employerStats.rejectedApplicants, icon: "❌", color: "#FF6B6B" },
  ];

  // Config charts cho employer
  const employerJobGrowthConfig = {
    data: employerJobGrowthData,
    xField: "month",
    yField: "value",
    smooth: true,
    point: { size: 4 },
    height: 200,
  };

  const employerApplicantConfig = {
    data: employerApplicantData,
    xField: "month",
    yField: "value",
    columnStyle: { radius: [4, 4, 0, 0] },
    color: "#48C9B0",
    height: 200,
  };

  // Biểu đồ tròn cho tỷ lệ chấp nhận/từ chối
  const acceptRejectPieData = [
    { type: "Accepted", value: employerStats.acceptedApplicants },
    { type: "Rejected", value: employerStats.rejectedApplicants },
  ];

  const acceptRejectPieConfig = {
    data: acceptRejectPieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ value }: { value: number }) => `${value}`,
      style: { fontSize: 14, fontWeight: 600 },
    },
    color: ["#48C9B0", "#FF6B6B"],
    height: 160,
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        {isAdmin ? "Admin Analytics" : "Employer Analytics"}
      </Title>

      {/* Hiển thị dashboard theo role */}
      {isAdmin && (
        <>
          {/* Thẻ thống kê ngang - Admin */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }} justify="space-evenly">
            {statCards.map(card => (
              <Col key={card.title} xs={24} sm={12} md={6} lg={6} xl={5}>
                <Card style={{ textAlign: 'center', borderTop: `4px solid ${card.color}`, height: '100%' }}>
                  <div style={{ fontSize: 32 }}>{card.icon}</div>
                  <Title level={2} style={{ margin: 0 }}>{card.value}</Title>
                  <Text type="secondary">{card.title}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[20, 20]}>
            {/* User Growth */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>User Growth</Title>
                <Text type="secondary">New Users</Text>
                <Line {...userGrowthConfig} />
              </Card>
            </Col>

            {/* Job Postings */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Job Postings</Title>
                <Text type="secondary">New Job Postings</Text>
                <Column {...jobPostingConfig} />
              </Card>
            </Col>

            {/* Thống kê ứng viên đã apply job posting */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Candidates have applied for the Job</Title>
                <Title level={2}>{totalApplications}</Title>
                <Text type="secondary">Application Rate / Total Job Postings</Text>
                <Pie {...applyPieConfig} />
              </Card>
            </Col>

            {/* CV Submitted */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>CV Submitted</Title>
                <Title level={2}>370</Title>
                <Text type="secondary">CV Submitted</Text>
                <Column {...cvSubmittedConfig} />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {isEmployer && (
        <>
          {/* Thẻ thống kê ngang - Employer */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }} justify="space-evenly">
            {employerStatCards.map(card => (
              <Col key={card.title} xs={24} sm={12} md={6} lg={6} xl={5}>
                <Card style={{ textAlign: 'center', borderTop: `4px solid ${card.color}`, height: '100%' }}>
                  <div style={{ fontSize: 32 }}>{card.icon}</div>
                  <Title level={2} style={{ margin: 0 }}>{card.value}</Title>
                  <Text type="secondary">{card.title}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[20, 20]}>
            {/* Job Postings Growth - Employer */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Job Postings Growth</Title>
                <Text type="secondary">Your Job Postings Over Time</Text>
                <Line {...employerJobGrowthConfig} />
              </Card>
            </Col>

            {/* Applicant Statistics */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Applicant Statistics</Title>
                <Text type="secondary">Applications Received</Text>
                <Column {...employerApplicantConfig} />
              </Card>
            </Col>

            {/* Accept/Reject Rate */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Application Status</Title>
                <Title level={2}>{employerStats.totalApplicants}</Title>
                <Text type="secondary">Total Applications</Text>
                <Pie {...acceptRejectPieConfig} />
              </Card>
            </Col>

            {/* Quick Summary */}
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Summary</Title>
                <div style={{ marginTop: 20 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                        <Text type="secondary">Active Jobs</Text>
                        <Title level={3} style={{ margin: 0, color: '#0284c7' }}>
                          {employerStats.totalJobPostings}
                        </Title>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <Text type="secondary">Acceptance Rate</Text>
                        <Title level={3} style={{ margin: 0, color: '#16a34a' }}>
                          {employerStats.totalApplicants > 0 
                            ? Math.round((employerStats.acceptedApplicants / employerStats.totalApplicants) * 100) 
                            : 0}%
                        </Title>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
