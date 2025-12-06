import { Form, Input, Button, Modal } from "antd";
import { useEffect } from "react";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./category.type";

interface CategoryFormProps {
  open: boolean;
  category?: Category;
  onSubmit: (values: CreateCategoryRequest | UpdateCategoryRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm = ({
  open,
  category,
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  }, [category, form, open]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={category ? "Edit Category" : "Create Category"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="category_form">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of the category!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
