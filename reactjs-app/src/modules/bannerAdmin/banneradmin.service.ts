import axios from "axios";
import type {  BannerAdminType } from "./banneradmin.type";

// Get all banners (for Approve page)
export const fetchBannerAdmins = async (): Promise<BannerAdminType[]> => {
  const response = await axios.get("http://localhost:8080/api/banners");
  return Array.isArray(response.data) ? response.data : response.data.data;
};

// Get Active banners (đang hoạt động)
export const fetchActiveBanners = async (): Promise<BannerAdminType[]> => {
  const response = await axios.get("http://localhost:8080/api/banners/active");
  return Array.isArray(response.data) ? response.data : response.data.data;
};

// Get Approved banners (đã duyệt chờ lên)
export const fetchApprovedBanners = async (): Promise<BannerAdminType[]> => {
  const response = await axios.get("http://localhost:8080/api/banners/approved");
  return Array.isArray(response.data) ? response.data : response.data.data;
};

export const deleteBannerAdmin = async (id: number) => {
  const response = await axios.delete(`http://localhost:8080/api/banners/${id}`);
  return response.data;
};

export const approveBannerAdmin = async (id: number) => {
  const response = await axios.patch(`http://localhost:8080/api/banners/${id}/approve`);
  return response.data;
};

export const rejectBannerAdmin = async (id: number, reason: string) => {
  const response = await axios.patch(`http://localhost:8080/api/banners/${id}/reject?reason=${encodeURIComponent(reason)}`);
  return response.data;
};

