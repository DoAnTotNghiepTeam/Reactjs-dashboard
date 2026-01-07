import { type JobPosting } from "../types/employerJobAplicant.type";
import apiClient from "../libs/api-client";

export const jobService = {
  getAll: async () => {
    return apiClient.get<JobPosting[]>("/job-postings/all");
  },

  create: async (data: JobPosting): Promise<JobPosting> => {
    const res = await apiClient.post("/job-postings", data);
    return res.data;
  },

  getDetail: async (id: number): Promise<JobPosting> => {
    const res = await apiClient.get<JobPosting>(`/job-postings/${id}`);
    console.log("🔍 API Response:", res);
    console.log("🔍 API Response Data:", res.data);
    // Nếu res.data là undefined, return res (data nằm trực tiếp trong res)
    return res.data || (res as any);
  },

  update: async (id: number, data: Partial<JobPosting>): Promise<JobPosting> => {
    const res = await apiClient.patch(`/job-postings/${id}`, data);
    return res.data;
  },

  deleteJob: async (id: number) => {
    return apiClient.delete(`/job-postings/${id}`);
  },
};
