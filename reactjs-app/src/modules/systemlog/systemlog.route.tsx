import { FileSearchOutlined } from '@ant-design/icons';
import type { RouteItem } from '../../routes';
import SystemLogPage from './SystemLogPage';

export const routesSystemLog: RouteItem[] = [
  {
    path: '/systemlog',
    label: <span style={{ fontSize: 18, fontWeight: 'bold' }}>System Log</span>,
    key: 'systemlog',
    icon: <FileSearchOutlined style={{ fontSize: 22, color: '#66789c' }} />,
    element: <SystemLogPage />,
    isShowMenu: true,
    isPrivate: true,
    roles: ['Administrators'], // Chỉ admin mới thấy
  },
];
