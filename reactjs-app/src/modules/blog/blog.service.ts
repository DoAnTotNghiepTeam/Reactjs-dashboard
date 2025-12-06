import axios from "axios";
import type {
  BlogType,
  CreateBlogRequest,
  UpdateBlogRequest,
  CategoryType,
} from "./blog.type";

const API_BASE_URL = "http://localhost:8080/api";

// Lấy danh sách tất cả blog
export const fetchBlogs = async (): Promise<BlogType[]> => {
  const response = await axios.get<BlogType[]>(`${API_BASE_URL}/blogs`);
  return response.data;
};

// Lấy blog theo ID
export const fetchBlogById = async (id: number): Promise<BlogType> => {
  const response = await axios.get<BlogType>(`${API_BASE_URL}/blogs/${id}`);
  return response.data;
};

// Tạo blog mới
export const createBlog = async (
  categoryId: number,
  payload: CreateBlogRequest
): Promise<BlogType> => {
  const response = await axios.post<BlogType>(
    `${API_BASE_URL}/blogs/${categoryId}`,
    payload
  );
  return response.data;
};

// Cập nhật blog
export const updateBlog = async (
  id: number,
  payload: UpdateBlogRequest
): Promise<BlogType> => {
  const query = payload.categoryId ? `?categoryId=${payload.categoryId}` : "";
  const response = await axios.put<BlogType>(
    `${API_BASE_URL}/blogs/${id}${query}`,
    payload
  );
  return response.data;
};

// Xóa blog
export const deleteBlog = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/blogs/${id}`);
};

// Lấy danh sách category
export const fetchCategories = async (): Promise<CategoryType[]> => {
  const response = await axios.get<CategoryType[]>(
    `${API_BASE_URL}/categories`
  );
  return response.data;
};

// Upload file ảnh
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{ url: string }>(
    `${API_BASE_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
