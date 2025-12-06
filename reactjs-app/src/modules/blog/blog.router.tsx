import { FileTextOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import BlogPage from "./blogPage";

export const routesBlog: RouteItem[] = [
  {
    path: "/blog",
    label: (
      <span style={{ fontSize: 18, fontWeight: "bold", color: "#66789c" }}>
        Blog
      </span>
    ),
    key: "blog",
    icon: <FileTextOutlined style={{ fontSize: 21, color: "#66789c" }} />,
    element: <BlogPage />,
    isShowMenu: true,
    isPrivate: true,
    roles : [ "Administrators"]
  },
];
