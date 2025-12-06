import { Table, Card, Button, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import type { EmployerType } from '../employer.type';

interface EmployerTableProps {
    data?: EmployerType[];
    loading: boolean;
    columns: ColumnsType<EmployerType>;
    pagination?: any;
    onAddClick?: () => void;
}

const EmployerTable: React.FC<EmployerTableProps> = ({
    data = [],
    loading,
    columns,
    pagination,
    onAddClick,
}) => {
    return (
        <Card
            title="Employer List"
            extra={
                onAddClick ? (
                    <Button type="primary" onClick={onAddClick}>
                        Thêm mới
                    </Button>
                ) : null
            }
        >
            {loading ? (
                <Spin tip="Loading">
                    <div className="content" />
                </Spin>
            ) : (
                <>
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={pagination} />
                    <div style={{ textAlign: 'right', marginTop: 30 }}>
                    </div>
                </>
            )}
        </Card>
    );
};

export default EmployerTable;
