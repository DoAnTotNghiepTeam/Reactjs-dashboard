import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../stores/useAuthorStore";
import { toast } from "react-toastify";
import styles from "../../styles/EmployerJobFormPage.module.css";

const initialState = {
  title: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "",
  category: "",
  requiredSkills: "",
  minExperience: "",
  requiredDegree: "",
  endAt: "",
  status: "ACTIVE",
  postType: "normal",
};

export default function CreateJobPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = useAuthStore((state) => state.loggedInUser);
  const employerId = loggedInUser?.id;

  const degreeOptions = ["Bachelor's Degree", "Associate's Degree", "Vocational Certificate", "No degree required"];

  const postTypeOptions = [
    {
      value: "vip",
      label: "Post VIP",
      price: 2,
      priceLabel: "2$/day",
      description: "Bạn có thể đăng tin với hiển thị nổi bật và đề xuất hàng đầu.",
    },
    {
      value: "normal",
      label: "Post Normal",
      price: 1,
      priceLabel: "1$/day",
      description: "Bạn chỉ có thể đăng tin với hiển thị đơn giản.",
    },
  ];

  const locationOptions = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];

  const minDate = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (form.endAt && form.endAt < minDate) {
      toast.error("Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại!");
      setLoading(false);
      return;
    }

    if (!employerId) {
      toast.error("Bạn cần đăng nhập bằng tài khoản nhà tuyển dụng!");
      setLoading(false);
      return;
    }

    const salaryMinStr = String((form as any).salaryMin || "").trim();
    const salaryMaxStr = String((form as any).salaryMax || "").trim();
    if ((salaryMinStr && !salaryMaxStr) || (!salaryMinStr && salaryMaxStr)) {
      toast.error("Vui lòng nhập cả mức lương.");
      setLoading(false);
      return;
    }
    if (salaryMinStr && salaryMaxStr) {
      const min = Number(salaryMinStr);
      const max = Number(salaryMaxStr);
      if (isNaN(min) || isNaN(max) || max <= min) {
        toast.error("Giá trị lương không hợp lệ: Max phải lớn hơn Min.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
      employerId,
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "",
      salaryRange: salaryMinStr && salaryMaxStr ? `${salaryMinStr}-${salaryMaxStr} triệu` : "",
      postType: form.postType,
    };

    try {
      console.log("Submitting job payload:", payload);
      const response = await jobService.create(payload as any);
      console.log("Job created successfully:", response);
      toast.success("Đăng việc thành công! Số dư đã được trừ.");
      
      // Reload trang để cập nhật số dư trong header
      setTimeout(() => {
        navigate("/employerjob");
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("❌ Create job error FULL:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);
      
      // Xử lý các loại lỗi khác nhau - thử nhiều cách lấy message
      let errorMessage = "Không thể đăng việc";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log("📢 Final error message to display:", errorMessage);
      
      // Force hiển thị alert để chắc chắn user thấy
      alert(errorMessage);
      
      // Và vẫn hiển thị toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFee = () => {
    if (!form.endAt) return 0;

    const startDate = new Date();
    const endDate = new Date(form.endAt);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

    const price = postTypeOptions.find((opt) => opt.value === form.postType)?.price || 0;

    return price * diffDays;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>
          <span style={{ fontSize: 32, marginRight: 8 }}>📝</span> Create New Job
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Loại bài đăng */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Loại bài đăng *</label>
            <select
              className={styles.select}
              name="postType"
              value={form.postType}
              onChange={handleChange}
              required
            >
              {postTypeOptions.map((opt) => (
                <option 
                  key={opt.value} 
                  value={opt.value}
                  style={{
                    color: opt.value === "vip" ? "#ef4444" : "#1890ff",
                    fontWeight: opt.value === "vip" ? 600 : 500,
                  }}
                >
                  {opt.label} ({opt.priceLabel})
                </option>
              ))}
            </select>
            <div className={styles.postTypeInfo}>
              <span
                className={styles.badge}
                style={{
                  backgroundColor: form.postType === "vip" ? "#ef4444" : "#facc15",
                  color: form.postType === "vip" ? "#fff" : "#1e293b",
                }}
              >
                {postTypeOptions.find((opt) => opt.value === form.postType)?.label}
              </span>
              <div className={styles.description}>
                {postTypeOptions.find((opt) => opt.value === form.postType)?.description}
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            {/* Job Title */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title *</label>
              <input
                type="text"
                className={styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="e.g. ReactJS Developer"
              />
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <input
                type="text"
                className={styles.input}
                name="category"
                value={form.category}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Information Technology"
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Job Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              rows={7}
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed job description..."
            />
          </div>

          <div className={styles.formRow}>
            {/* Location */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <select
                className={styles.select}
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              >
                <option value="">Select province/city</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Salary Range</label>
              <div className={styles.salaryRow}>
                <input
                  type="number"
                  className={styles.input}
                  name="salaryMin"
                  value={(form as any).salaryMin}
                  onChange={handleChange}
                  min={0}
                  placeholder="Min"
                  style={{ maxWidth: 140 }}
                />
                <span style={{ padding: "0 10px", fontWeight: 700 }}>-</span>
                <input
                  type="number"
                  className={styles.input}
                  name="salaryMax"
                  value={(form as any).salaryMax}
                  onChange={handleChange}
                  min={0}
                  placeholder="Max"
                  style={{ maxWidth: 140 }}
                />
                <span style={{ marginLeft: 10, color: "#6b7280" }}>triệu</span>
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            {/* Job Type */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type *</label>
              <select
                className={styles.select}
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                required
              >
                <option value="">Select job type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            {/* Degree */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Required Degree</label>
              <select
                className={styles.select}
                name="requiredDegree"
                value={form.requiredDegree}
                onChange={handleChange}
              >
                <option value="">Select degree</option>
                {degreeOptions.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            {/* Experience */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Minimum Experience (years)</label>
              <input
                type="number"
                className={styles.input}
                name="minExperience"
                value={form.minExperience}
                onChange={handleChange}
                min={0}
                placeholder="e.g. 1"
              />
            </div>

            {/* Expiration Date */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Expiration Date</label>
              <input
                type="date"
                className={styles.input}
                name="endAt"
                value={form.endAt}
                onChange={handleChange}
                min={minDate}
                required
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Required Skills <span className={styles.muted}>(comma separated)</span>
            </label>
            <input
              type="text"
              className={styles.input}
              name="requiredSkills"
              value={form.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, SQL"
            />
          </div>

          {/* Status and Total Fee Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ maxWidth: 600 }}>
              <label className={styles.label}>Status</label>
              <input
                type="text"
                className={styles.input}
                name="status"
                value="Active"
                disabled
                readOnly
                style={{ fontWeight: 600, background: '#f0f0f0', color: '#666' }}
              />
            </div>

            {/* Tổng phí */}
            {form.endAt && (
              <div className={styles.formGroup} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <div className={styles.totalFee}>
                  <span style={{ fontSize: "1.5rem", marginRight: 8 }}>💸</span>
                  <span style={{ fontWeight: 700, color: "#2563eb", fontSize: "1.1rem", letterSpacing: 1 }}>
                    Tổng phí:
                  </span>
                  <span style={{ fontWeight: 800, color: "#059669", fontSize: "1.5rem", marginLeft: 8 }}>
                    {calculateTotalFee()}$
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/employerjob")}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
