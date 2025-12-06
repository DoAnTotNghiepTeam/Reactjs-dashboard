import { PictureOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import BannerEmployerPage from "./BanneremployerPage";

export const routesBannerEmployer: RouteItem[] = [
	{
		path: "/banneremployer",
		label: <span style={{ fontSize: 18, fontWeight: "bold" }}>Advertising rental</span>,
		key: "banneremployer",
		icon: <PictureOutlined style={{ fontSize: 22, color: "#66789c" }} />,
		element: <BannerEmployerPage />,
		isShowMenu: true,
		isPrivate: true,
		roles: ["Employers"], // Chỉ employer có quyền truy cập
	},
];
