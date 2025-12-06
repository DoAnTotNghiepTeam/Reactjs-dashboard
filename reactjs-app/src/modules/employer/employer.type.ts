export interface EmployerType {
  id: number;
  username: string;
  email: string;
  fullName: string;
  status: string;
  phoneNumber?: string | null;
  avatar?: string | null;
}
export interface EmployerListResponse {
    data: EmployerType[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
// employer-approve
export interface EmployerApproveType {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
}

