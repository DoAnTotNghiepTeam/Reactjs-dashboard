
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicantService } from "../../services/applicant.service";
import { jobService } from "../../services/job.service";
import type {
  JobPosting,
} from "../../types/employerJobAplicant.type";
import styles from "../../styles/EmployerJobsPage.module.css";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";


export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1); // ✅ 1-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [isExpired, setIsExpired] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [applicantCounts, setApplicantCounts] = useState<
    Record<number, number>
  >({});
  const [newApplicantCounts, setNewApplicantCounts] = useState<
    Record<number, number>
  >({});

  const navigate = useNavigate();

  const fetchJobs = async (currentPage: number) => {
    setLoading(true);
    try {
      const res= await applicantService.getMyJobs({
          page: currentPage,
          size: pageSize,
          sortBy,
          sortDir,
          status,
          isExpired,
          startDate,
          endDate,
        });
     
      setJobs(res.data.content|| []);
      setTotalPages(res.data.totalPages || 1);
      console.log("👉 Response data:", res.data.content);
      console.log("👉 Response page:", res.data.totalPages);

      // build counts
      const counts: Record<number, number> = {};
      const newCounts: Record<number, number> = {};
      (res.data.content || []).forEach((job : JobPosting) => {
        counts[job.id] = job.applicantsCount ?? 0;
        newCounts[job.id] = job.newApplicantsCount ?? 0;
      });
      setApplicantCounts(counts);
      setNewApplicantCounts(newCounts);
    } catch (err) {
      console.error("❌ Lỗi load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page, sortBy, sortDir, status, isExpired, startDate, endDate]);

  const handleDelete = async (id: number) => {
    if (!confirm("  Are you sure you want to delete this job?")) return;
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success(" Job deleted successfully!");
    } catch (err) {
      console.error("❌ Lỗi xóa job:", err);
      toast.error(" Job deletion failed!");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Job List</h1>
        <button
          className={styles.createBtn}
          onClick={() => navigate("/employerjob/jobs/create")}
        >
          <FiPlus /> Create Job
        </button>
      </div>

      {/* Sort */}
      <div className={styles.sortBar}></div>
      {/* Filter */}
      <div className={styles.filterBar}>
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Post date</option>
          <option value="lastAppliedAt">Last applied</option>
          <option value="applicantsCount">Total applicants</option>
          <option value="title">Job title</option>
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <label>Status:</label>
        <select
          value={status ?? ""}
          onChange={(e) => setStatus(e.target.value || undefined)}
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
          {/* <option value="DRAFT">Draft</option> */}
        </select>

        <label>Expiration date:</label>
        <select
          value={isExpired === undefined ? "" : isExpired ? "true" : "false"}
          onChange={(e) =>
            setIsExpired(
              e.target.value === "" ? undefined : e.target.value === "true"
            )
          }
        >
          <option value="">-- Expiration date --</option>
          <option value="false">Active</option>
          <option value="true">Expired</option>
        </select>
        <label>
          From date:
          <input
            type="date"
            value={startDate ? startDate.split("T")[0] : ""}
            onChange={(e) =>
              setStartDate(
                e.target.value ? `${e.target.value}T00:00:00` : undefined
              )
            }
          />
        </label>

        <label>
          To date:
          <input
            type="date"
            value={endDate ? endDate.split("T")[0] : ""}
            onChange={(e) =>
              setEndDate(
                e.target.value ? `${e.target.value}T23:59:59` : undefined
              )
            }
          />
        </label>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading job list...</p>
      ) : jobs.length === 0 ? (
        <p className={styles.empty}>No job found.</p>
      ) : (
        <>
          <div className={styles.jobsGrid}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <h2 className={styles.jobTitle}>{job.title}</h2>
                <span className={styles.applicantBadge}>
                  <FiUsers className={styles.icon} />{" "}
                  {applicantCounts[job.id] ?? 0} Candidates
                </span>
                <p>{job.description?.slice(0, 100)}...</p>

                <div className={styles.skillsContainer}>
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className={styles.jobInfoRow}>
                  <span>
                    <FiMapPin className={styles.icon} /> {job.location}
                  </span>
                  <span>
                    <FiDollarSign className={styles.icon} /> {job.salaryRange}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span>
                    <FiBriefcase className={styles.icon} /> {job.minExperience}{" "}
                    Year
                  </span>
                  <span>
                    <FiCalendar className={styles.icon} />{" "}
                    {new Date(job.endAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/employerjob/jobs/${job.id}/edit`)}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(job.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                  <button
                    className={styles.viewBtn}
                    onClick={async () => {
                      try {
                        await applicantService.markApplicantsRead(job.id);
                        setNewApplicantCounts((prev) => ({
                          ...prev,
                          [job.id]: 0,
                        }));
                        navigate(`/employerjob/jobs/${job.id}/applicants`);
                      } catch (err) {
                        console.error("❌ Lỗi markApplicantsRead:", err);
                        navigate(`/employerjob/jobs/${job.id}/applicants`);
                      }
                    }}
                  >
                    <FiUsers /> Views
                    {newApplicantCounts[job.id] > 0 && (
                      <span className={styles.badge}>
                        {newApplicantCounts[job.id] > 99
                          ? "99+"
                          : newApplicantCounts[job.id]}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              ⬅ Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
