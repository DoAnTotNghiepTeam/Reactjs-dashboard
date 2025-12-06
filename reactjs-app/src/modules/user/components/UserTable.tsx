import React from 'react'

import type { UserType } from '../user.type';
import { Card , Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UserTableProps {
    data?: UserType[];
    loading: boolean;
    columns: ColumnsType<UserType>;
}


const UserTable: React.FC<UserTableProps> = ({
    data,
    loading,
    columns,
}) => {
    return (
        <Card
            title="User List"
        >
            {loading ? (
                <Spin tip="Loading">
                    <div className="content" />
                </Spin>
            ) : (
                <>
                    <Table rowKey="id" columns={columns} dataSource={data} />
                    <div style={{ textAlign: 'right', marginTop: 30, marginLeft: 30 }}>
                    </div>
                </>
            )}
        </Card>
    );
};

export default UserTable;