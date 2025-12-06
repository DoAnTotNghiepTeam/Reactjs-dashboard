import { UserOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import EmployerJobsPage from "./EmployerJobsPage";
import JobApplicantsPage from "./JobApplicantsPage";
import ApplicantDetailPage from "./ApplicantDetailPage";
// import EmployerJobFormPage from "./EmployerJobFormPage";

export const routesjobPosting: RouteItem[] = [
  {
    path: "/employerjob", 
    label: (
      <span style={{ fontSize: 18, fontWeight: "bold" }}>Job Posting</span>
    ),
    key: "employerjob",
    icon: <UserOutlined style={{ fontSize: 22, color: "#66789c" }} />,
    element: <EmployerJobsPage />,
    isShowMenu: true,
    isPrivate: true,
    roles: ["Employers"],
  },
     
      {
        path: "/employerjob/jobs/:jobId/applicants", 
        label: "Danh sách ứng viên",
        key: "job-applicants",
        element: <JobApplicantsPage />,
        isShowMenu: false, 
        isPrivate: true,
        roles: ["Employers"],
      },
      {
        path: "/employerjob/applicants/:applicantId",
        label: "Chi tiết ứng viên",
        key: "applicant-detail",
        element: <ApplicantDetailPage />,
        isShowMenu: false,
        isPrivate: true,
        roles: ["Employers"],
      },
      //  {
      //     path: "/employerjob/jobs/create", // ✅ route tạo job
      //   label: "Tạo job mới",
      //   key: "job-create",
      //   element: <EmployerJobFormPage />,
      //   isShowMenu: false,
      //   isPrivate: true,
      //   roles: ["Employers"],
      // },
      //  {
      //   path: "/employerjob/jobs/:id/edit", // ✅ route sửa job
      //   label: "Chỉnh sửa job",
      //   key: "job-edit",
      //   element: <EmployerJobFormPage />,
      //   isShowMenu: false,
      //   isPrivate: true,
      //   roles: ["Employers"],
      // },
  
    
];
