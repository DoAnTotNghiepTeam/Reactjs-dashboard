import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { applicantService } from "../../services/applicant.service";
import type { ApplicantResponse } from "../../types/employerJobAplicant.type";
import styles from "../../styles/JobApplicantsPage.module.css";
import { ArrowLeftIcon } from "lucide-react";
import { ApplicationStatus } from "./ApplicantDetailPage";

const statusFlow: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDING: ["CV_PASSED"],
  CV_PASSED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
};

function ApplicantRow({
  applicant,
  onOpenModal,
  onDetail,
}: {
  applicant: ApplicantResponse;
  onOpenModal: (applicant: ApplicantResponse) => void;
  onDetail: (id: number) => void;
}) {
  return (
    <tr>
      <td>{applicant.fullName}</td>
      <td>{applicant.coverLetter}</td>
      <td>
        <a
          href={applicant.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cvLink}
        >
          View CV
        </a>
      </td>
      <td>{applicant.applicationStatus}</td>
      <td>
        {applicant.applicationStatus === 'HIRED' || applicant.applicationStatus === 'REJECTED' 
          ? (
            <span style={{ 
              color: applicant.applicationStatus === 'HIRED' ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {applicant.applicationStatus}
            </span>
          )
          : (
            <button
              className={styles.updateBtn}
              onClick={() => onOpenModal(applicant)}
            >
              Update
            </button>
          )
        }
      </td>
      <td>
        <button
          onClick={() => onDetail(applicant.id)}
          className={styles.detailBtn}
        >
          Detail
        </button>
      </td>
    </tr>
  );
}

export default function JobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<ApplicantResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">(
    ""
  );

  // modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantResponse | null>(null);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [note, setNote] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState("");
  const [interviewer, setInterviewer] = useState("");

  const fetchApplicants = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await applicantService.getApplicantsByJob(
        Number(jobId),
        selectedStatus as ApplicationStatus
      );
      setApplicants(res.data.applicants);
      setStats(res.data.stats);
    } catch (err) {
      console.error("❌ Lỗi load applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, selectedStatus]);

  const handleUpdateStatus = async () => {
    if (!selectedApplicant || !status) {
      toast.error("⚠️ Please select a status");
      return;
    }

    if (status === ApplicationStatus.INTERVIEW && !scheduledAt) {
      toast.error("⚠️ Please select interview date/time");
      return;
    }

    try {
      await applicantService.updateApplicantStatus(
        selectedApplicant.id,
        status as ApplicationStatus,
        note,
        scheduledAt || undefined,
        location || undefined,
        interviewer || undefined
      );
      await fetchApplicants();
      
      // Trigger refresh notifications sau khi update status
      window.dispatchEvent(new Event('refreshNotifications'));
      
      toast.success("✅ Update success");
      setOpenModal(false);
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("❌ Update failed");
    }
  };

  return (
    <div className={styles.jobApplicants}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeftIcon />
      </button>

      {/* Thống kê */}
      
      {/* Stats + Filter chung 1 hàng */}
      <div className={styles.topBar}>
        <div className={styles.statsBar}>
        {Object.entries(stats).map(([status, count]) => (
          <span key={status} className={styles.statItem}>
            {status}: {count}
          </span>
        ))}
      </div>
        {/* <div className={styles.statsBar}>
          {[
            ApplicationStatus.PENDING,
            ApplicationStatus.CV_PASSED,
            ApplicationStatus.INTERVIEW,
            ApplicationStatus.HIRED,
            ApplicationStatus.REJECTED,
          ].map((status) => (
            <span key={status} className={styles.statItem}>
              {status}: {stats[status] ?? 0}
            </span>
          ))}
        </div> */}

        {/* Filter */}
        <div className={styles.filterBar}>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ApplicationStatus | "")
            }
          >
            <option value="">ALL</option>
            {[
              ApplicationStatus.PENDING,
              ApplicationStatus.CV_PASSED,
              ApplicationStatus.INTERVIEW,
              ApplicationStatus.HIRED,
              ApplicationStatus.REJECTED,
            ].map((s) => (
              <option key={s} value={s}>
                {s} ({stats[s] ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading candidate list...</p>
      ) : applicants.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <table className={styles.applicantsTable}>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Cover Letter</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Update status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <ApplicantRow
                key={a.id}
                applicant={a}
                onOpenModal={(applicant) => {
                  setSelectedApplicant(applicant);
                  setStatus(applicant.applicationStatus as ApplicationStatus);
                  setNote("");
                  setScheduledAt("");
                  setLocation("");
                  setInterviewer("");
                  setOpenModal(true);
                }}
                onDetail={(id) => navigate(`/employerjob/applicants/${id}`)}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {openModal && selectedApplicant && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>
              Update Status for <b>{selectedApplicant.fullName}</b>
            </h2>

            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            >
              <option value="">-- Select Status --</option>
              {statusFlow[
                selectedApplicant.applicationStatus as ApplicationStatus
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {status === "INTERVIEW" && selectedApplicant.applicationStatus !== "INTERVIEW" && (
              <div className={styles.interviewForm}>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className={styles.datetimeInput}
                />
                <input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={styles.noteInput}
                />
                <input
                  placeholder="Interviewer"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className={styles.noteInput}
                />
              </div>
            )}

            <textarea
              placeholder="Notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={styles.noteInput}
            />

            <div className={styles.modalActions}>
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button onClick={handleUpdateStatus}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
