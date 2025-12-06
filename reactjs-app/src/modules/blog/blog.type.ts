export interface CategoryType {
  id: number;
  name: string;
  description: string;
}

export interface BlogType {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  categoryId?: number;
}

export interface BlogListResponse {
  data: BlogType[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
