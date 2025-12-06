import { DatabaseOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import CompanyPage from "../companyInformation/CompanyPage";



export const routesCandidate: RouteItem[] = [
    {
        path: '/candidate',
        label: <span style={{ fontSize: 18, fontWeight: 'bold' }}>Company Information</span>,
        key: 'candidate',
        icon: <DatabaseOutlined style={{ fontSize: 21, color: '#66789c' }} />,
        element: <CompanyPage />,
        isShowMenu: true,
        isPrivate: true,
        roles : ["Employers"], // hoặc ["Employers"]
    },
]