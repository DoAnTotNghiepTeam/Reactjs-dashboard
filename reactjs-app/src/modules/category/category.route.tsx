import { AppstoreOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import CategoryPage from "./CategoryPage";

export const routesCategory: RouteItem[] = [
  {
    path: "/category",
    label: (
      <span style={{ fontSize: 18, fontWeight: "bold", color: "#66789c" }}>
        Category
      </span>
    ),
    key: "category",
    icon: <AppstoreOutlined style={{ fontSize: 21, color: "#66789c" }} />,
    element: <CategoryPage />,
    isShowMenu: true,
    isPrivate: true,
    roles : [ "Administrators"]
  },
];
