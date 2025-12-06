import AboutUsPage from "./AboutUsPage";
import { FileTextOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";

export const aboutUsRoute: RouteItem[] = [
  {
    path: "/aboutus",
    label: (
      <span style={{ fontSize: 18, fontWeight: "bold", color: "#66789c" }}>
        AboutUs
      </span>
    ),
    key: "aboutUs",
    icon: <FileTextOutlined style={{ fontSize: 21, color: "#66789c" }} />,
    element: <AboutUsPage />,
    isShowMenu: true,
    isPrivate: true,
    roles : [ "Administrators"]
  },
];
