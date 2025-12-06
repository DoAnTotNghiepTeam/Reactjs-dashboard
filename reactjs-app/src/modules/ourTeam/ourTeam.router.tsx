import { TeamOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes/index";
import OurTeamPage from "./OurTeamPage";

export const routesOurTeam: RouteItem[] = [
  {
    key: "ourteam",
    path: "ourteam",
    label: (
      <span style={{ fontSize: 18, fontWeight: "bold", color: "#66789c" }}>
        Our Team
      </span>
    ),
    element: <OurTeamPage />,
    icon: <TeamOutlined style={{ fontSize: 21, color: "#66789c" }} />,
    isShowMenu: true,
    isPrivate: true,
    roles : [ "Administrators"]
  },
];
