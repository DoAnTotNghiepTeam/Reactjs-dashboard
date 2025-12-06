"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppMessage } from "../../stores/useAppMessage";
import BlogTable from "./blogTable";
import BlogForm from "./blogForm";
import BlogPreviewModal from "./BlogPreviewModel";
import type {
  BlogType,
  CreateBlogRequest,
  CategoryType,
  UpdateBlogRequest,
} from "./blog.type";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchCategories,
} from "./blog.service";

const BlogPage = () => {
  const queryClient = useQueryClient();
  const { sendMessage } = useAppMessage();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | undefined>(
    undefined
  );
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewBlog, setPreviewBlog] = useState<BlogType | null>(null);

  const msgSuccess = (msg: string) => {
    sendMessage({
      msg,
      type: "success",
    });
  };

  const msgError = (msg: string) => {
    sendMessage({
      msg,
      type: "error",
    });
  };

  // Fetch blogs
  const queryBlogs = useQuery<BlogType[]>({
    queryKey: ["blogs"],
    queryFn: async () => fetchBlogs(),
  });

  // Fetch categories
  const queryCategories = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => fetchCategories(),
  });

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: number;
      payload: CreateBlogRequest;
    }) => createBlog(categoryId, payload),
    onSuccess: (created) => {
      // Cập nhật ngay danh sách trên cache để hiển thị tức thì
      queryClient.setQueryData<BlogType[]>(["blogs"], (old) =>
        old ? [created, ...old] : [created]
      );
      // Vẫn invalidate để đồng bộ với server
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setIsModalOpen(false);
      msgSuccess("Tạo blog thành công!");
    },
    onError: (error: unknown) => {
      console.error("Create blog error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Tạo blog thất bại!";
      msgError(errorMessage);
    },
  });

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBlogRequest }) =>
      updateBlog(id, payload),
    onSuccess: (updated) => {
      // Thay thế item trong cache theo id
      queryClient.setQueryData<BlogType[]>(["blogs"], (old) =>
        old ? old.map((b) => (b.id === updated.id ? updated : b)) : old
      );
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setIsModalOpen(false);
      setEditingBlog(undefined);
msgSuccess("Cập nhật blog thành công!");
    },
    onError: (error: unknown) => {
      console.error("Update blog error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Cập nhật blog thất bại!";
      msgError(errorMessage);
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: (_void, id) => {
      // Loại bỏ item ngay trên cache để hiển thị tức thì
      queryClient.setQueryData<BlogType[]>(["blogs"], (old) =>
        old ? old.filter((b) => b.id !== id) : old
      );
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      msgSuccess("Xóa blog thành công!");
    },
    onError: () => {
      msgError("Xóa blog thất bại!");
    },
  });

  const handleAddClick = () => {
    setEditingBlog(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: BlogType) => {
    console.log("Editing blog:", blog); // Debug log
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteBlogMutation.mutate(id);
  };

  const handleSubmit = (values: CreateBlogRequest & { categoryId: number }) => {
    console.log("Form values:", values); // Debug log

    const { categoryId, ...payload } = values;

    if (editingBlog) {
      console.log("Updating blog:", editingBlog.id, payload); // Debug log
      updateBlogMutation.mutate({
        id: editingBlog.id,
        payload: { ...payload, categoryId },
      });
    } else {
      console.log("Creating blog:", categoryId, payload); // Debug log
      createBlogMutation.mutate({ categoryId, payload });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBlog(undefined);
  };

  const handlePreview = (blog: BlogType) => {
    setPreviewBlog(blog);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewBlog(null);
  };

  return (
    <div>
      <BlogTable
        data={queryBlogs.data ?? []}
        loading={queryBlogs.isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
        onAddClick={handleAddClick}
      />

      <Modal
        title={editingBlog ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
        maskClosable={false}
        centered
      >
        <BlogForm
          blog={editingBlog}
          categories={queryCategories.data ?? []}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createBlogMutation.isPending || updateBlogMutation.isPending}
        />
      </Modal>

      <BlogPreviewModal
        visible={isPreviewModalOpen}
        blog={previewBlog}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default BlogPage;