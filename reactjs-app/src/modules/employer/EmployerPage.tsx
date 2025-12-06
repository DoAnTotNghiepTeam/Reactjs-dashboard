import { useQuery } from "@tanstack/react-query";
import { fetchEmployers } from "./employer.service";
import { type TableProps } from "antd";
import type { EmployerType, EmployerListResponse } from "./employer.type";
import { useState } from "react";
import EmployerTable from "./components/EmployerTable";

const EmployerPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const queryEmployers = useQuery<EmployerListResponse>({
        queryKey: ["employers", currentPage],
        queryFn: async () => fetchEmployers(currentPage - 1), // BE page bắt đầu từ 0
                placeholderData: {
                    data: [],
                    pageNumber: 0,
                    pageSize: 10,
                    totalRecords: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrevious: false,
                },
    });

    const columns: TableProps<EmployerType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phoneNumber: string | null) =>
                phoneNumber ? phoneNumber : <span style={{ color: '#999' }}>Not Updated Yet</span>,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar: string | null) =>
                avatar ? (
                    <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                ) : (
                    <span style={{ color: '#999' }}>Not Updated Yet</span>
                ),
        },
    ];

    const employerData = queryEmployers.data?.data ?? [];
    const pagination = {
        current: (queryEmployers.data?.pageNumber ?? 0) + 1,
        pageSize: queryEmployers.data?.pageSize ?? 10,
        total: queryEmployers.data?.totalRecords ?? 0,
        onChange: (page: number) => setCurrentPage(page),
    };

    return (
        <div>
            <EmployerTable
                data={Array.isArray(employerData) ? employerData : []}
                loading={queryEmployers.isLoading}
                columns={columns}
                pagination={pagination}
                onAddClick={undefined as any}
            />
        </div>
    );
};

export default EmployerPage;
