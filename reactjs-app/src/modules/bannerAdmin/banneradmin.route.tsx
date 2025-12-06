import type { RouteItem } from "../../routes";
import BannerAdminPage from "./BannerAdminPage";
import { SafetyCertificateOutlined } from "@ant-design/icons";

export const routesBannerAdmin: RouteItem[] = [
  {
    path: '/banneradmin',
    label: <span style={{ fontSize: 18, fontWeight: 'bold' }}>Banner Admin</span>,
    key: 'banneradmin',
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#66789c' }} />,
    element: <BannerAdminPage />,
    isShowMenu: true,
    isPrivate: true,
    roles: ["Administrators"],
  },
];
