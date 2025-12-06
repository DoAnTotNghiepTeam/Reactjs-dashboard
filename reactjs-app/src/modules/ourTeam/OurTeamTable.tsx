import { Table, Button, Space, Popconfirm } from "antd";
import type { OurTeam } from "./ourTeam.type";

interface OurTeamTableProps {
  ourTeams: OurTeam[];
  onEdit: (ourTeam: OurTeam) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const OurTeamTable = ({
  ourTeams,
  onEdit,
  onDelete,
  loading,
}: OurTeamTableProps) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Our Team",
      dataIndex: "ourTeam",
      key: "ourTeam",
      render: (text: string) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "ourTeamTitle",
      key: "ourTeamTitle",
      render: (text: string) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "ourTeamDescription",
      key: "ourTeamDescription",
      render: (text: string) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "viTri",
      key: "viTri",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text: string) => (
        <img src={text} alt="avatar" style={{ width: "50px" }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: OurTeam) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={ourTeams}
      rowKey="id"
      loading={loading}
    />
  );
};

export default OurTeamTable;
