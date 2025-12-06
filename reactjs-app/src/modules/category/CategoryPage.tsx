import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppMessage } from "../../stores/useAppMessage";
import categoryApi from "./category.service";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./category.type";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";

const CategoryPage = () => {
  const queryClient = useQueryClient();
  const { sendMessage } = useAppMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined
  );

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      sendMessage({
        type: "success",
        msg: "Category created successfully!",
      });
      setIsModalOpen(false);
    },
    onError: () => {
      sendMessage({
        type: "error",
        msg: "Failed to create category.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      sendMessage({
        type: "success",
        msg: "Category updated successfully!",
      });
      setIsModalOpen(false);
      setEditingCategory(undefined);
    },
    onError: () => {
      sendMessage({
        type: "error",
        msg: "Failed to update category.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      sendMessage({
        type: "success",
        msg: "Category deleted successfully!",
      });
    },
    onError: () => {
      sendMessage({
        type: "error",
        msg: "Failed to delete category.",
      });
    },
  });

  const handleAddClick = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
    refetch();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    refetch();
  };

  const handleSubmit = (
    values: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values });
    } else {
      createMutation.mutate(values as CreateCategoryRequest);
    }
    refetch();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <div>
      <CategoryTable
        data={Array.isArray(categories) ? categories : categories?.data ?? []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={handleAddClick}
      />
      <CategoryForm
        open={isModalOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default CategoryPage;
