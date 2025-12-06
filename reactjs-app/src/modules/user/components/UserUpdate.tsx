import React from 'react';
import type { UserType } from '../user.type';
import { Form, Input, Modal, Select, type FormInstance } from 'antd';

const ROLE_OPTIONS = [
    { label: "Administrators", value: 1 },
    { label: "Employers", value: 2 },
    { label: "Users", value: 3 },
];

type UserUpdateProps = {
    isModalUpdateOpen: boolean;
    onOk: () => void;
    onCancel: () => void;
    form: FormInstance;
    onFinish: (values: UserType) => void;
    onFinishFailed: (errorInfo: any) => void;
    queryUsers: { data?: UserType[] };
};

const UserUpdate: React.FC<UserUpdateProps> = ({
    isModalUpdateOpen,
    onOk,
    onCancel,
    form,
    onFinish,
    onFinishFailed,
}) => {
    return (
        <Modal
            title="Update User"
            open={isModalUpdateOpen}
            onOk={onOk}
            onCancel={onCancel}
            okText="Cập nhật thông tin user"
            cancelText="Đóng"
        >
            <Form
                form={form}
                layout="vertical"
                name="update-user-form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Chưa nhập username' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Chưa nhập email' }]}
                    hasFeedback
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Chưa nhập full name' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Chưa chọn role' }]}
                    hasFeedback
                >
                    <Select options={ROLE_OPTIONS} />
                </Form.Item>

                <Form.Item hidden name="id">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserUpdate;
