export interface CompanyType {
  id: number;
  address: string;
  banner_url: string;
  company_name: string;
  description: string;
  email: string;
  industry: string;
  location: string;
  logo_url: string;
  max_employees: number;
  min_employees: number;
  phone: string;
  website: string;
}

export interface CompanyListResponse {
    data: CompanyType[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}