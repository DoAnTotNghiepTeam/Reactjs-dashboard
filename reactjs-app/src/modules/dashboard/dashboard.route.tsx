import { HomeOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import DashboardPage from "./DashboardPage";

export const routesDashboard: RouteItem[] = [
  {
    path: '/dashboard',
    label: <span style={{ fontSize: 18, fontWeight: 'bold' }}>Dashboard</span>,
    key: 'dashboard',
    icon: <HomeOutlined style={{ fontSize: 21, color: '#66789c' }} />,
    element: <DashboardPage />,
    isShowMenu: true, // Hiển thị menu cho route này
    isPrivate: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
]