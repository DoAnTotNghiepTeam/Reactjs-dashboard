import { Table, Card, Button, Spin, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "./category.type";

interface CategoryTableProps {
  data?: Category[];
  loading: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (id: number) => void;
  onAddClick?: () => void;
}

const CategoryTable = ({
  data = [],
  loading,
  onEdit,
  onDelete,
  onAddClick,
}: CategoryTableProps) => {
  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "action",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Category List"
      extra={
        onAddClick ? (
          <Button type="primary" onClick={onAddClick}>
            Add New Category
          </Button>
        ) : null
      }
    >
      {loading ? (
        <Spin tip="Loading...">
          <div style={{ height: "300px" }} />
        </Spin>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} categories`,
          }}
        />
      )}
    </Card>
  );
};

export default CategoryTable;
