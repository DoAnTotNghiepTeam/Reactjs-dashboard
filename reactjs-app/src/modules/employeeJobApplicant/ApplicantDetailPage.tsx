import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applicantService } from "../../services/applicant.service";
import type {
  ApplicantTracking,
  TimelineEvents,
} from "../../types/employerJobAplicant.type";
import styles from "../../styles/ApplicantDetailPage.module.css";
import { ArrowLeftIcon } from "lucide-react";

export const ApplicationStatus = {
  PENDING: "PENDING",
  CV_PASSED: "CV_PASSED",
  INTERVIEW: "INTERVIEW",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export default function ApplicantDetailPage() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [tracking, setTracking] = useState<ApplicantTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDetail = async () => {
    if (!applicantId) return;
    setLoading(true);
    try {
      const res = await applicantService.getEmployeeTracking(
        Number(applicantId)
      );
      setTracking(res.data);
    } catch (err) {
      console.error("❌ Lỗi load applicant detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [applicantId]);

  if (loading) return <p>Loading...</p>;
  if (!tracking || !tracking.detail) return <p>No candidates found.</p>;

  const applicant = tracking.detail;
  // const history: ApplicantHistory[] = tracking.history || [];
  const currentStatus = applicant.applicationStatus;

  return (
    <div className={styles.applicantContainer}>
      <button className={styles.applicantBack} onClick={() => navigate(-1)}>
        <ArrowLeftIcon></ArrowLeftIcon>
      </button>

      <div className={styles.applicantDetailGrid}>
        {/* Left Column: Applicant + Job Info */}
        <div className={styles.applicantLeft}>
          <div className={styles.applicantHeader}>
            <h1 className={styles.applicantTitle}>{applicant.fullName}</h1>
            <p className={styles.applicantInfo}>
              <strong>Job:</strong> {applicant.jobTitle}
            </p>
            <p className={styles.applicantInfo}>
              {" "}
              <strong>Company:</strong> {applicant.companyName}
            </p>

            <p className={styles.applicantInfo}>{applicant.location_company}</p>

            <p className={styles.applicantInfo}>
              <strong>Current status:</strong>
              <span
                className={`${styles.applicantStatus} ${
                  styles[`status${currentStatus}`]
                }`}
              >
                {currentStatus}
              </span>
            </p>
            <p className={styles.applicantInfo}>
              <strong>Skill match:</strong> {applicant.skillMatchPercent}%
            </p>

            <p className={styles.applicantInfo}>
              <strong>Min experience required:</strong>{" "}
              {applicant.minExperience}
            </p>
            <p className={styles.applicantInfo}>
              <strong>Skill qualified:</strong>{" "}
              {applicant.isSkillQualified ? "✅" : "❌"}
            </p>
            <p className={styles.applicantInfo}>
              <strong>Experience qualified:</strong>{" "}
              {applicant.isExperienceQualified ? "✅" : "❌"}
            </p>
            <p className={styles.applicantInfo}>
              <strong>Missing skills:</strong>{" "}
              {applicant.missingSkills.join(", ") || "None"}
            </p>

            <p className={styles.applicantInfo}>
              <strong>Resume:</strong>{" "}
              <a
                href={applicant.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </p>
            <p className={styles.applicantInfo}>
              <strong>Cover letter:</strong> {applicant.coverLetter || "None"}
            </p>
            <p className={styles.applicantInfo}>
              <strong>Applied at:</strong>{" "}
              {new Date(applicant.appliedAt).toLocaleString()}
            </p>
            {/* <p className={styles.applicantInfo}><strong>Job description:</strong> {applicant.description}</p> */}
          </div>
        </div>
        {/* Right Column: Timeline */}
        <div className={styles.applicantRight}>
          <div className={styles.timeline}>
            <h2>Timeline</h2>
            {tracking.timeline.length === 0 ? (
              <p className={styles.applicantInfo}>No timeline yet.</p>
            ) : (
              <ul className={styles.timelineList}>
                {tracking.timeline
                  .filter((step) => step.completed || step.currentStep) // chỉ show completed + current
                  .map((step, idx) => {
                    const isCurrent = step.currentStep;
                    const stepClass = isCurrent
                      ? styles.timelineItemCurrent
                      : styles.timelineItemCompleted;

                    return (
                      <li
                        key={idx}
                        className={`${styles.timelineItem} ${stepClass}`}
                      >
                        <div className={styles.timelineItemCircle}>
                          {isCurrent ? idx + 1 : "✓"}
                        </div>
                        <ul className={styles.timelineSubList}>
                          {step.events.map(
                            (event: TimelineEvents, i: number) => (
                              <li key={i} className={styles.timelineSubItem}>
                                {"scheduledAt" in event ? (
                                  <>
                                    <p>
                                      <strong>Interview:</strong>{" "}
                                      {new Date(
                                        event.scheduledAt
                                      ).toLocaleString()}
                                    </p>
                                    <p>
                                      <strong>Location:</strong>{" "}
                                      {event.location}
                                    </p>
                                    <p>
                                      <strong>Interviewer:</strong>{" "}
                                      {event.interviewer}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className={styles.timelineStatus}>
                                      {event.status}
                                    </p>
                                    {event.note && (
                                      <p className={styles.timelineNote}>
                                        {event.note}
                                      </p>
                                    )}
                                    <p className={styles.timelineMeta}>
                                      {new Date(
                                        event.changedAt
                                      ).toLocaleString()}{" "}
                                      - {event.changedBy}
                                    </p>
                                  </>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div> 
      </div>
    </div>
  );
}
