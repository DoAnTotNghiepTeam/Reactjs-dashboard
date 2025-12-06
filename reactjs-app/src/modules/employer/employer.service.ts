import axios from "axios";
import type {EmployerListResponse  } from "./employer.type";


export const fetchEmployers = async (page: number = 0): Promise<EmployerListResponse> => {
    const response = await axios.get(`http://localhost:8080/api/employers?page=${page}`);
    return {
        data: response.data.data ?? [],
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrevious: response.data.hasPrevious,
    };
};
// hiển thị dánh sách yêu cầu chờ phê duyệt
export const fetchUpgradeEmployers = async (page?: number) => {
  const url = page !== undefined
    ? `http://localhost:8080/api/employers/upgradeEmployer?page=${page}`
    : `http://localhost:8080/api/employers/upgradeEmployer`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch employers");
  return res.json();
};

// api phê duyệt 
export const approveEmployer = async (employerId: string) => {
    const res = await fetch(`http://localhost:8080/api/users/approve-employer/${employerId}`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to approve employer");
    return res.text();
}

// api từ chối
export const rejectEmployer = async (employerId: string) => {
    const res = await fetch(`http://localhost:8080/api/users/reject-employer/${employerId}`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to reject employer");
    return res.text();
}

