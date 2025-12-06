// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { jobService } from "../../services/job.service";
// import type { JobPosting } from "../../types/employerJobAplicant.type";
// import styles from "../../styles/EmployerJobFormPage.module.css";

// const getEmployerIdFromStorage = (): number | null => {
//   try {
//     const raw = localStorage.getItem("auth-storage-for-login");
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     return parsed?.state?.loggedInUser?.id ?? null;
//   } catch (err) {
//     console.error("❌ Error reading auth-storage-for-login:", err);
//     return null;
//   }
// };

// export default function EmployerJobFormPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const employerId = getEmployerIdFromStorage();

//   const [form, setForm] = useState<Partial<JobPosting>>({
//     employerId: employerId ?? undefined,
//     title: "",
//     description: "",
//     location: "",
//     salaryRange: "",
//     jobType: "",
//     category: "",
//     requiredSkills: [],
//     minExperience: 0,
//     requiredDegree: "",
//     status: "Active",
//     endAt: "",
//   });

//   // Load job detail nếu edit
//   useEffect(() => {
//     if (id) {
//       jobService.getDetail(Number(id)).then((res) => {
//         const data = res.data; // lấy đúng object JobPosting từ API
//         setForm({
//           employerId: employerId ?? data.employerId,
//           title: data.title ?? "",
//           description: data.description ?? "",
//           location: data.location ?? "",
//           salaryRange: data.salaryRange ?? "",
//           jobType: data.jobType ?? "",
//           category: data.category ?? "",
//           requiredSkills: data.requiredSkills || [],
//           minExperience: data.minExperience ?? "",
//           requiredDegree: data.requiredDegree ?? "",
//           status: data.status ?? "Active",
//           endAt: data.endAt
//             ? new Date(data.endAt).toISOString().split("T")[0]
//             : "",
//         });
//       });
//     }
//   }, [id, employerId]);

//   // Handle input change
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle requiredSkills as comma-separated string
//   const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const skills = e.target.value
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s);
//     setForm((prev) => ({ ...prev, requiredSkills: skills }));
//   };

//   // Handle minExperience as number
//   const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value === "" ? "" : Number(value),
//     }));
//   };

//   // Handle date change
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({
//       ...prev,
//       endAt: e.target.value ? new Date(e.target.value).toISOString() : "",
//     }));
//   };

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.employerId) {
//       alert("❌ Employer ID not found (are you logged in?)");
//       return;
//     }

//     try {
//       if (id) {
//         await jobService.update(Number(id), form);
//         alert("✅ Job updated successfully!");
//       } else {
//         await jobService.create(form as JobPosting);
//         alert("✅ Job created successfully!");
//       }
//       navigate("/employerjob");
//     } catch (err) {
//       console.error("❌ Error saving job:", err);
//       alert("❌ Could not save job");
//     }
//   };

//   return (
//     <form className={styles.formContainer} onSubmit={handleSubmit}>
//       <h1 className={styles.formTitle}>
//         {id ? "Edit Job Posting" : "Create New Job"}
//       </h1>

//       <input
//         type="hidden"
//         name="employerId"
//         value={form.employerId || ""}
//         className={styles.hiddenInput}
//       />

//       <input
//         name="title"
//         value={form.title}
//         onChange={handleChange}
//         placeholder="Job Title"
//         className={styles.formInput}
//       />

//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Job Description"
//         className={styles.formTextarea}
//       />

//       <input
//         name="location"
//         value={form.location}
//         onChange={handleChange}
//         placeholder="Location"
//         className={styles.formInput}
//       />

//       <input
//         name="salaryRange"
//         value={form.salaryRange}
//         onChange={handleChange}
//         placeholder="Salary Range (e.g. 1000 - 2000 USD)"
//         className={styles.formInput}
//       />

//       <input
//         name="jobType"
//         value={form.jobType}
//         onChange={handleChange}
//         placeholder="Job Type (Full-time, Part-time, ...)"
//         className={styles.formInput}
//       />

//       <input
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//         placeholder="Category (IT, Sales, Marketing...)"
//         className={styles.formInput}
//       />

//       <input
//         name="requiredSkills"
//         value={Array.isArray(form.requiredSkills) ? form.requiredSkills.join(", ") : ""}
//         onChange={handleSkillsChange}
//         placeholder="Required Skills (comma separated)"
//         className={styles.formInput}
//       />

//       <input
//         type="number"
//         name="minExperience"
//         value={form.minExperience}
//         onChange={handleNumberChange}
//         placeholder="Minimum Experience (years)"
//         className={styles.formInput}
//       />

//       <input
//         name="requiredDegree"
//         value={form.requiredDegree}
//         onChange={handleChange}
//         placeholder="Required Degree"
//         className={styles.formInput}
//       />

//       <input
//         type="date"
//         name="endAt"
//         value={form.endAt}
//         onChange={handleDateChange}
//         className={styles.formInput}
//       />

//       <input
//         name="status"
//         value={form.status}
//         onChange={handleChange}
//         placeholder="Status (Active, Closed, ...)"
//         className={styles.formInput}
//       />

//       <button type="submit" className={styles.formButton}>
//         {id ? "Save Changes" : "Create Job"}
//       </button>
//     </form>
//   );
// }
