import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ourTeamService } from "./ourTeam.service";
import type { OurTeam } from "./ourTeam.type";
import OurTeamTable from "./OurTeamTable";
import OurTeamForm from "./OurTeamForm";
import { Button } from "antd";

const OurTeamPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOurTeam, setSelectedOurTeam] = useState<OurTeam | undefined>(
    undefined
  );

  const {
    data: ourTeams,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ourTeams"],
    queryFn: ourTeamService.getAll,
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedOurTeam(undefined);
    refetch();
  };

  const handleEdit = (ourTeam: OurTeam) => {
    setSelectedOurTeam(ourTeam);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await ourTeamService.delete(id);
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
        <h2 style={{ fontWeight: "bold", margin: 0 }}>Our Team Management</h2>
        <Button
          type="primary"
          onClick={() => {
            setShowForm(true);
            setSelectedOurTeam(undefined);
          }}
        >
          Add New Member
        </Button>
      </div>
      {showForm ? (
        <OurTeamForm
          initialValues={selectedOurTeam}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedOurTeam(undefined);
          }}
        />
      ) : (
        <OurTeamTable
          ourTeams={ourTeams ? (Array.isArray(ourTeams) ? ourTeams : ourTeams.data) : []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default OurTeamPage;
