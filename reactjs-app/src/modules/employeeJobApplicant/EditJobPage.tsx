import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { toast } from "react-toastify";
import styles from "../../styles/EmployerJobFormPage.module.css";

interface JobForm {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  category: string;
  requiredSkills: string;
  minExperience: string | number;
  requiredDegree: string;
  endAt: string;
  status: string;
  postType: string;
  createdAt?: string;
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<JobForm>({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    jobType: "",
    category: "",
    requiredSkills: "",
    minExperience: "",
    requiredDegree: "",
    endAt: "",
    status: "active",
    postType: "normal",
    createdAt: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [originalEndDate, setOriginalEndDate] = useState<string>("");

  const degreeOptions = ["Đại học", "Cao đẳng", "Trung cấp"];
  const locationOptions = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
  const postTypeOptions = [
    { value: "vip", label: "Post VIP", price: 2, priceLabel: "2$/day" },
    { value: "normal", label: "Post Normal", price: 1, priceLabel: "1$/day" },
  ];

  const calculateTotalFee = () => {
    if (!form.endAt) return 0;
    const startDate = new Date();
    const endDate = new Date(form.endAt);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    const price = postTypeOptions.find((opt) => opt.value === (form.postType || "normal"))?.price || 1;
    return price * diffDays;
  };

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log("Fetching job with ID:", id);
        const data = await jobService.getDetail(Number(id));
        console.log("Job data received:", data);
        
        const formData: JobForm = {
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          salaryRange: data.salaryRange || "",
          jobType: data.jobType || "",
          category: data.category || "",
          requiredSkills: Array.isArray(data.requiredSkills)
            ? data.requiredSkills.join(", ")
            : "",
          minExperience: data.minExperience ? String(data.minExperience) : "",
          requiredDegree: data.requiredDegree || "",
          endAt: data.endAt ? data.endAt.slice(0, 10) : "",
          status: "active",
          postType: data.postType || "normal",
          createdAt: data.createdAt || "",
        };
        
        console.log("Setting form data:", formData);
        setForm(formData);
        setOriginalEndDate(data.endAt ? data.endAt.slice(0, 10) : "");
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Lỗi khi lấy dữ liệu job");
      } finally {
        setLoading(false);
      }
    }
    
    fetchJob();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tính toán sự thay đổi về số ngày và tiền
    const priceDiff = calculatePriceDifference();
    const feeDiff = calculateFeeDifference();
    let confirmMessage = "✅ Bạn có chắc muốn cập nhật job này?";
    
    if (priceDiff > 0) {
      confirmMessage = `📈 TĂNG THỜI GIAN ĐĂNG TIN\n\n` +
        `• Số ngày tăng thêm: ${Math.abs(priceDiff)} ngày\n` +
        `• Số tiền cần thanh toán: ${feeDiff}$\n` +
        `• Tiền sẽ được trừ từ tài khoản của bạn\n\n` +
        `Bạn có muốn tiếp tục?`;
    } else if (priceDiff < 0) {
      confirmMessage = `📉 GIẢM THỜI GIAN ĐĂNG TIN\n\n` +
        `• Số ngày giảm đi: ${Math.abs(priceDiff)} ngày\n` +
        `• Số tiền được hoàn trả: ${Math.abs(feeDiff)}$\n` +
        `• Tiền sẽ được cộng vào tài khoản của bạn\n\n` +
        `Bạn có muốn tiếp tục?`;
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      status: form.status ? form.status.toUpperCase() : "ACTIVE",
      requiredSkills: form.requiredSkills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "",
      postType: form.postType,
    };

    try {
      await jobService.update(Number(id), payload as any);
      
      if (priceDiff !== 0) {
        toast.success(`Cập nhật thành công! ${priceDiff > 0 ? 'Đã trừ' : 'Đã hoàn'} ${Math.abs(calculateFeeDifference())}$ ${priceDiff > 0 ? 'từ' : 'vào'} tài khoản.`);
      } else {
        toast.success("Cập nhật việc làm thành công!");
      }
      
      setTimeout(() => {
        navigate("/employerjob");
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Update job error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Không thể cập nhật việc làm";
      
      if (errorMessage.includes("insufficient") || errorMessage.includes("balance") || errorMessage.includes("không đủ")) {
        toast.error("⚠️ Số dư không đủ để tăng thời gian! Vui lòng nạp thêm tiền.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePriceDifference = () => {
    if (!originalEndDate || !form.endAt) return 0;
    
    const originalDate = new Date(originalEndDate);
    const newDate = new Date(form.endAt);
    const startDate = form.createdAt ? new Date(form.createdAt) : new Date();
    
    startDate.setHours(0, 0, 0, 0);
    originalDate.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);
    
    const originalDays = Math.max(Math.ceil((originalDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 1);
    const newDays = Math.max(Math.ceil((newDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 1);
    
    return newDays - originalDays;
  };

  const calculateFeeDifference = () => {
    const daysDiff = calculatePriceDifference();
    const price = postTypeOptions.find((opt) => opt.value === (form.postType || "normal"))?.price || 1;
    return Math.abs(daysDiff * price);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>
          <span style={{ fontSize: 32, marginRight: 8 }}>📝</span> Edit Job
        </h2>

        {loading && !form.title ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Post Type */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Post Type *</label>
              <select
                className={styles.select}
                name="postType"
                value={form.postType}
                onChange={handleChange}
                required
                style={{ fontWeight: 600, fontSize: "15px" }}
              >
                {postTypeOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{
                      color: opt.value === "vip" ? "#ef4444" : "#1890ff",
                      fontWeight: opt.value === "vip" ? 700 : 600,
                    }}
                  >
                    {opt.label} ({opt.priceLabel})
                  </option>
                ))}
              </select>
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

              {/* Salary Range */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Salary Range</label>
                <input
                  type="text"
                  className={styles.input}
                  name="salaryRange"
                  value={form.salaryRange}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. 15-20 million"
                />
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
                  <option value="intern">Intern</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
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
              <div className={styles.formGroup} style={{ maxWidth: 300 }}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.select}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={{ fontWeight: 600, background: '#f0f0f0', color: '#666' }}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
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
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate("/employerjob")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ 
                      display: "inline-block", 
                      animation: "spin 1s linear infinite",
                      marginRight: "8px"
                    }}>⏳</span>
                    Đang cập nhật...
                  </>
                ) : (
                  "Update Job"
                )}
              </button>
            </div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </form>
        )}
      </div>
    </div>
  );
}
