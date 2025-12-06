import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Image, Popconfirm, Space, Table } from "antd";
import React from "react";
import aboutUsService from "./aboutUs.service";
import type { AboutUs } from "./aboutUs.type";

interface AboutUsTableProps {
  data: AboutUs[];
  loading: boolean;
  onEdit: (aboutUs: AboutUs) => void;
}

const AboutUsTable: React.FC<AboutUsTableProps> = ({
  data = [],
  loading,
  onEdit,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => aboutUsService.deleteAboutUs(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
    },
  });

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Company Title",
      dataIndex: "companyTitle",
      key: "companyTitle",
    },
    {
      title: "Company Description",
      dataIndex: "companyDescription",
      key: "companyDescription",
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
      title: "Services Title",
      dataIndex: "servicesSectionTitle",
      key: "servicesSectionTitle",
    },
    {
      title: "Services Description",
      dataIndex: "servicesSectionDescription",
      key: "servicesSectionDescription",
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) => <Image src={url} width={100} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: AboutUs) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this about us entry?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
  );
};

export default AboutUsTable;
