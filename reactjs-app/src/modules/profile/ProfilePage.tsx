import { Card, Typography, Avatar, Spin, Form, Input, Button } from "antd";
import { useAuthStore } from "../../stores/useAuthorStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateUser } from "./profile.service";
import { UserOutlined, DollarCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const userId = useAuthStore((state) => state.loggedInUser?.id);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const res = await fetchProfile(userId!);
      const profile = res.data ? res.data : res;
      return {
        ...profile,
        balance: profile.balance ? Number(profile.balance) : 0,
      };
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, ...payload } = data;
      return await updateUser(id, payload);
    },
    onSuccess: () => {
      toast.success("Update information successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: () => {
      toast.error("❌ Update failed!");
    },
  });

  if (isLoading || !data) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 36 }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ background: "#1890ff" }}
          />
          <Typography.Title level={4} style={{ marginTop: 12, marginBottom: 0 }}>
            Personal Information
          </Typography.Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: data.username,
            fullName: data.fullName,
            email: data.email,
          }}
          onFinish={(values) => {
            mutation.mutate({
              id: data.id,
              username: values.username,
              fullName: values.fullName,
              email: data.email,
              status: data.status ?? null,
              roles: data.roles ?? [],
            });
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Enter username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Enter full name!" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}
          >
            <Input placeholder="Email" disabled />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending}
              style={{ fontWeight: 600, borderRadius: 10 }}
            >
              Update Information
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <DollarCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
          <Typography.Text>
            Số dư:{" "}
            <b>
              {typeof data.balance === "number"
                ? data.balance.toLocaleString()
                : 0}{" "}
              VNĐ
            </b>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
