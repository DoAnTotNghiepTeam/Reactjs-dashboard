import { UserOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import ProfilePage from "./ProfilePage";

export const routesProfile: RouteItem[] = [
  {
    path: "/profile",
    label: <span style={{ fontSize: 18, fontWeight: "bold" }}>Profile</span>,
    key: "profile",
    icon: <UserOutlined style={{ fontSize: 22, color: "#66789c" }} />,
    element: <ProfilePage />,
    isShowMenu: true,
    isPrivate: true,
    roles: ["Employers"],
  },
];
