import type { RouteItem } from "../../routes";
import BannerListPage from "./BannerListPage";
import ApproveBannerPage from "./ApproveBannerPage";
import { SafetyCertificateOutlined, UnorderedListOutlined, CheckCircleOutlined } from "@ant-design/icons";

export const routesBannerAdmin: RouteItem[] = [
  {
    path: '',
    label: <span style={{ fontSize: 18, fontWeight: 'bold', color: '#66789c' }}>Banner Admin</span>,
    key: 'banner-admin',
    icon: <SafetyCertificateOutlined style={{ fontSize: 21, color: '#66789c' }} />,
    isShowMenu: true,
    isPrivate: true,
    roles: ["Administrators"],
    children: [
      {
        path: '/banner/admin/list',
        label: <span style={{ fontSize: 17, fontWeight: 'bold' }}>Banner List</span>,
        key: 'banner-admin-list',
        icon: <UnorderedListOutlined style={{ fontSize: 16, color: '#66789c' }} />,
        element: <BannerListPage />,
        isShowMenu: true,
        isPrivate: true,
      },
      {
        path: '/banner/admin/approve',
        label: <span style={{ fontSize: 17, fontWeight: 'bold' }}>Approve Banner</span>,
        key: 'banner-admin-approve',
        icon: <CheckCircleOutlined style={{ fontSize: 16, color: '#66789c' }} />,
        element: <ApproveBannerPage />,
        isShowMenu: true,
        isPrivate: true,
      },
    ],
  },
];

