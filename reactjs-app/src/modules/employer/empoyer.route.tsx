import { DatabaseOutlined, UnorderedListOutlined,CheckCircleOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import EmployerPage from "./EmployerPage";
import EmployerUpgradeList from "./EmployerUpgradeList";



export const routesEmployer: RouteItem[] = [
    {
        path: '',
        label: <span style={{ fontSize: 18, fontWeight: 'bold', color: '#66789c' }}>Employers</span>,
        key: 'employer',
        icon: <DatabaseOutlined style={{ fontSize: 21, color: '#66789c' }} />,
        isShowMenu: true,
        isPrivate: true,
        roles : ["Administrators"], // hoặc ["Employers"]
        children: [
            {
                path: '/employer',
                label: <span style={{ fontSize: 17, fontWeight: 'bold' }}>Employer List</span>,
                key: 'employer',
                icon: <UnorderedListOutlined style={{ fontSize: 16, color: '#66789c' }} />,
                element: <EmployerPage />,
                isShowMenu: true,
                isPrivate: true,
            },
            {
                path: '/employer/upgradeEmployer',
                label: <span style={{ fontSize: 17, fontWeight: 'bold' }}>Approve Employer</span>,
                key: 'employer-upgradeEmployer',
                icon: <CheckCircleOutlined style={{ fontSize: 16, color: '#66789c' }} />,
                element: <EmployerUpgradeList />,
                isShowMenu: true,
                isPrivate: true,
            }
        ]
    },
]