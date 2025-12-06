import { UserOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import UserPage from "./UserPage"
export const routesUser: RouteItem[] = [
    {
        path: '/user',
        label: <span style={{ fontSize: 18, fontWeight: 'bold' }}>User</span>,
        key: 'user',
        icon: <UserOutlined style={{ fontSize: 22, color: '#66789c' }} />,
        element: <UserPage />,
        isShowMenu: true,
        isPrivate: true,
        roles : ["Administrators"], // Chỉ Admin và Manager có quyền truy cập
    },
];