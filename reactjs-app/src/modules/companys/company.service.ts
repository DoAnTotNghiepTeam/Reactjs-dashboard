import axios from "axios";
import type { CompanyListResponse } from "./company.type";

export const fetchCompanys = async (page: number = 0): Promise<CompanyListResponse> => {
    const response = await axios.get(`http://localhost:8080/api/company?page=${page}`);
    return {
        data: response.data.data ?? [],
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrevious: response.data.hasPrevious,
    }
}

export const fetchSearchCompanys = async (name: string, page: number = 0): Promise<CompanyListResponse> => {
    const response = await axios.get(`http://localhost:8080/api/company/search?name=${encodeURIComponent(name)}&page=${page}`);
    return {
        data: response.data.data ?? [],
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrevious: response.data.hasPrevious,
    }
}