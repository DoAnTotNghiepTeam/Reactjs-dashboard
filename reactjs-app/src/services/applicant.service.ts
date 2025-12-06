
import apiClient from "../libs/api-client";
import type {
  ApplicantResponse,
  ApplicantsWithStatsDto,
  ApplicantTracking,


  TimelineEvent,
} from "../types/employerJobAplicant.type";
export const ApplicationStatus = {
  PENDING: "PENDING",
  CV_REVIEW: "CV_REVIEW",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const applicantService = {
 getApplicantsByJob: async (jobId: number, status?: ApplicationStatus)=> {
  const res = await apiClient.get<ApplicantsWithStatsDto>(
    `/employers-status/applicants/${jobId}`,
    {
      params: {
        status,
      },
    }
  );
   console.log("👉 Response full:", res);
  console.log("👉 Response data:", res.data);
  return res; // ✅ trả về ApplicantResponse[]
},


  getMyJobs: async ({
  page = 1, // FE dùng 1-based
  size = 6,
  sortBy = "createdAt",
  sortDir = "desc",
  status,
  isExpired,
  startDate,
  endDate,
}: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  status?: string;
  isExpired?: boolean;
  startDate?: string; // ISO string "2025-09-01T00:00:00"
  endDate?: string;
}) => apiClient.get(
    `/employers-status/jobs`,
    {
      params: {
        page: page - 1, // BE dùng 0-based
        size,
        sortBy,
        sortDir,
        status,
        isExpired,
        startDate,
        endDate,
      },
    }
  ),

markApplicantsRead: (jobId: number) =>
  apiClient.put(`/employers-status/jobs/${jobId}/mark-applicants-read`),


updateApplicantStatus: (
  id: number,
  status: string,
  note?: string,
  scheduledAt?: string,
  location?: string,
  interviewer?: string
) =>
  apiClient.put<ApplicantResponse>(
    `/employers-status/applicants/${id}/status`,
    { newStatus: status, note, scheduledAt, location, interviewer }
  ),


  getApplicantDetail: async (id: number) => {
    return apiClient.get<ApplicantTracking>(`/applicant/detail/${id}`);
  },
 getEmployeeTracking: (id: number) =>
    apiClient.get<ApplicantTracking>(`/employers-status/${id}/tracking`),

  getTracking: (id: number) =>
    apiClient.get<ApplicantTracking>(`/applicant/${id}/tracking`),

  getTimeline: (id: number) =>
    apiClient.get<TimelineEvent[]>(`/applicant/${id}/timeline`),

  addTimelineEvent: (id: number, payload: { status: string; note: string }) =>
    apiClient.post<TimelineEvent>(`/applicant/${id}/timeline`, payload),
};
