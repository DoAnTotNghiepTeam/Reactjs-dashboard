import  { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthorStore";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Login.css";

interface IFormInput {
  username: string;
  password: string;
}

const schema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(3, "Password must be at least 3 characters"),
  })
  .required();

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginStore = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      // email: "hoangle191205@gmail.com",
      // password: "123456789",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoginError(null);
    try {
      await loginStore.login({
        username: data.username, // ✅ dùng data từ form
        password: data.password,
        navigate,
      });
      // Nếu login thành công, store sẽ navigate sang dashboard
    } catch (error: any) {
      // Nếu backend trả về lỗi dạng error.response.data.Error
      const errMsg = error?.response?.data?.Error?.[0] || "Đã có lỗi xảy ra. Vui lòng thử lại , kiểm tra kĩ password hoặc username.";
      setLoginError(errMsg);
      message.error(errMsg); // Thông báo popup cho người dùng
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-welcome">Welcome back!</div>
          <h2 className="login-title">Admin Login</h2>
          <div className="login-desc">
            Access to all features. No credit card required.
          </div>

          {/* Social login */}
          <button className="login-social-btn google">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="login-social-icon"
            />
            Sign In with Google
          </button>

          <div className="login-or">
            <span>Or continue with</span>
          </div>

          {/* Form login */}
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="login-group">

              <label>Username *</label>
              <input
                type="text"
                placeholder="Enter your username"
{...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div className="login-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="************"
                {...register("password")} // ✅ liên kết với react-hook-form
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="login-forgot">
                Forgot Password
              </a>
            </div>

            {loginError && (
              <p className="text-red-600 text-sm mb-4 text-center">
                {loginError}
              </p>
            )}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>

        <img
          src="https://cdn.pixabay.com/photo/2017/01/31/13/14/balloon-2029335_1280.png"
          alt=""
          className="login-balloon"
        />
      </div>
    </div>
  );
}
