import apiClient from "../../libs/api-client";
import type {
  CreateOurTeamRequest,
  OurTeam,
  UpdateOurTeamRequest,
} from "./ourTeam.type";

const base = "/ourteam";

export const ourTeamService = {
  getAll: async () => {
    return await apiClient.get<OurTeam[]>(base);
  },
  getById: async (id: number) => {
    return await apiClient.get<OurTeam>(`${base}/${id}`);
  },
  create: async (data: CreateOurTeamRequest) => {
    return await apiClient.post<OurTeam>(base, data);
  },
  update: async (id: number, data: UpdateOurTeamRequest) => {
    return await apiClient.put<OurTeam>(`${base}/${id}`, data);
  },
  delete: async (id: number) => {
    return await apiClient.delete(`${base}/${id}`);
  },
};
