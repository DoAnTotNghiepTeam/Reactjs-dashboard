import { Button, Popconfirm, message } from "antd";
import { deleteBannerAdmin } from "../banneradmin.service";

interface BannerAdminDeleteProps {
  id: number;
  onDeleted: () => void;
}

export default function BannerAdminDelete({ id, onDeleted }: BannerAdminDeleteProps) {
  const handleDelete = async () => {
    try {
      await deleteBannerAdmin(id);
      message.success("Xóa banner thành công!");
      onDeleted();
    } catch {
      message.error("Xóa banner thất bại!");
    }
  };

  return (
    <Popconfirm title="Bạn chắc chắn muốn xóa banner này?" onConfirm={handleDelete} okText="Xóa" cancelText="Hủy">
      <Button danger size="small">Xóa</Button>
    </Popconfirm>
  );
}
