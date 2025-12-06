import api from "../../libs/api-client";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./category.type";

const categoryApi = {
  getAllCategories: () => {
    return api.get<Category[]>("/categories");
  },

  getCategoryById: (id: number) => {
    return api.get<Category>(`/categories/${id}`);
  },

  createCategory: (data: CreateCategoryRequest) => {
    return api.post("/categories", data);
  },

  updateCategory: (id: number, data: UpdateCategoryRequest) => {
    return api.put(`/categories/${id}`, data);
  },

  deleteCategory: (id: number) => {
    return api.delete(`/categories/${id}`);
  },
};

export default categoryApi;
