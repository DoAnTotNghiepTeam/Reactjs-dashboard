import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import aboutUsService from "./aboutUs.service";
import AboutUsForm from "./AboutUsForm";
import AboutUsTable from "./AboutUsTable";
import type { AboutUs } from "./aboutUs.type";

const AboutUsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAboutUs, setEditingAboutUs] = useState<AboutUs | undefined>(
    undefined
  );

  const {
    data: aboutUsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["aboutUs"],
    queryFn: async () => {
      const res = await aboutUsService.getAllAboutUs();
      return res.data;
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAboutUs(undefined);
  };

  const handleEdit = (aboutUs: AboutUs) => {
    setEditingAboutUs(aboutUs);
    showModal();
    refetch();
  };

  const handleFormSuccess = () => {
    handleCancel();
    refetch();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>About Us</h1>
        <Button type="primary" onClick={showModal}>
          Add About Us
        </Button>
      </div>
      <Modal
        title={editingAboutUs ? "Edit About Us" : "Add About Us"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <AboutUsForm
          initialValues={editingAboutUs}
          onSuccess={handleFormSuccess}
        />
      </Modal>
      <AboutUsTable
        data={aboutUsData || []}
        loading={isLoading}
        onEdit={handleEdit}
      /> 
    </div>
  );
};

export default AboutUsPage;
