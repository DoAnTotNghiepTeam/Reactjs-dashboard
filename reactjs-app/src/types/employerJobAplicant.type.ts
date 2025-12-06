export interface ApiResponse<T> {
status: "success" | "error";   // "success" | "error"
  message?: string;
  data: T;
}

export interface PaginatedEmployeeListJobResponseDto<T> {
  content: T[];        // danh sách job
  pageNumber: number;        // ⚠️ từ BE trả về 0-based
  pageSize: number;          // số record mỗi trang
  totalRecords: number;      // tổng số record
  totalPages: number;        // tổng số trang
  hasNext: boolean;
  hasPrevious: boolean;
}

export type JobPosting = {
  id: number;
  employerId: number;
  employerName: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  category: string;
  requiredSkills: string[];
  minExperience: number;
  requiredDegree: string;
  endAt: string;
  status: string;
  createdAt: string;
  applicantsCount: number;
   newApplicantsCount: number;
};
// export type PaginatedEmployeeListJobResponseDto = {
//   data: JobPosting[];
//    pageNumber: number;
//    pageSize: number;
//     totalRecords: number;
//     totalPages: number;
//     hasNext: boolean;
//     hasPrevious: boolean;
// };
export type Applicant = {
  id: number;
  fullName: string;
  resumeLink: string;
  coverLetter: string;
  skillMatchPercent: number;
};

export type ApplicantsWithStatsDto = {
    applicants: ApplicantResponse[];  // danh sách ứng viên
    stats: Record<string, number>;                // thống kê theo trạng thái
}
export type ApplicantResponse = {
  id: number;
  jobId: number;
  candidateId: number;
  resumesId: number;
  jobTitle: string;

  fullName: string;
  companyName: string;
  logoUrl: string;
  description_company: string;
  location_company: string;

  description: string;
  resumeLink: string;
  coverLetter: string;
  appliedAt: string;
  applicationStatus: string; // ApplicationStatus

  missingSkills: string[];
  minExperience: string;
  experienceYears: number;
  skillMatchPercent: number;
  isSkillQualified: boolean;
  isExperienceQualified: boolean;
  skillMatchMessage: string;
    history: ApplicantHistory[];
};

export type ApplicantHistory = {
  id: number;
  status: string;
  note: string;
  changedAt: string;
  changedBy: string;
};

export type ApplicantDetail = {
  id: number;
  jobTitle: string;
  fullName: string;
  coverLetter: string;
  applicationStatus: string;
  appliedAt: string;
  history: ApplicantHistory[];
};

export type InterviewSchedule = {
  id: number;
  scheduledAt: string;
  location: string;
  interviewer: string;
};
export interface TimelineEvent {
  stepOrder: number;
  status: string;
  events: ApplicantHistory[];
  currentStep: boolean;
  completed: boolean;
}

export type TimelineEvents = ApplicantHistory | InterviewSchedule;

export type ApplicantTimeline = {
  stepOrder: number;
  status: string;
  events: TimelineEvents[];
  currentStep: boolean;
  completed: boolean;
};
export interface ApplicantTracking {
  detail: ApplicantResponse;
  history: ApplicantHistory[];
  timeline: TimelineEvent[];
}
