import axios from "axios";
import type { BannerEmployer } from "./banneremployer.type";

// Upload banner image, trả về url ảnh
export const uploadBannerImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8080/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload ảnh thất bại!");

  return await res.json();
};

// Lấy banner theo userId
export const getBannersByUser = async (userId: number): Promise<BannerEmployer[]> => {
  const res = await axios.get(`http://localhost:8080/api/banners/user/${userId}`);

  // Nếu API trả về { data: [...] } thì lấy res.data.data, còn nếu trả về mảng thì lấy res.data
  return Array.isArray(res.data) ? res.data : res.data.data;
};

// Tạo banner mới = gia hạn banner
export const createBanner = async (
  formData: FormData,
  access_token: string
): Promise<any> => {
  const res = await axios.post("http://localhost:8080/api/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data;
};

// Cập nhật banner
export const updateBanner = async (
  id: number,
  formData: FormData,
  access_token: string
): Promise<any> => {
  console.log("📝 Update banner - ID:", id); // Debug
  const res = await axios.patch(`http://localhost:8080/api/banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
