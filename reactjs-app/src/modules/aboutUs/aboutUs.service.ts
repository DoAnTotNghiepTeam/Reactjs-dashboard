import type { AboutUs, CreateAboutUs } from "./aboutUs.type";
import api from "../../libs/api-client";

const base = "/aboutus";
const aboutUsService = {
  getAllAboutUs: async () => {
    return await api.get<AboutUs[]>(base);
  },
  getAboutUsById: async (id: number) => {
    return await api.get<AboutUs>(`${base}/${id}`);
  },
  createAboutUs: async (aboutUs: CreateAboutUs) => {
    return await api.post<AboutUs>(base, aboutUs);
  },
  updateAboutUs: async (id: number, aboutUs: Partial<CreateAboutUs>) => {
    return await api.patch<AboutUs>(`${base}/${id}`, aboutUs);
  },
  deleteAboutUs: async (id: number) => {
    return await api.delete(`${base}/${id}`);
  },
};

export default aboutUsService;
