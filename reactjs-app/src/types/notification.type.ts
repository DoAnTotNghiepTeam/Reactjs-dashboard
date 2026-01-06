// notification.type.ts
// Application Status constants
export const ApplicationStatus = {
  PENDING: 'PENDING',
  CV_PASSED: 'CV_PASSED',
  INTERVIEW: 'INTERVIEW',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

// Notification Type constants
export const NotificationType = {
  // Candidate notifications
  APPLY_SUCCESS: 'APPLY_SUCCESS',
  STATUS_UPDATE_PASSED: 'STATUS_UPDATE_PASSED',
  STATUS_UPDATE_INTERVIEW: 'STATUS_UPDATE_INTERVIEW',
  STATUS_UPDATE_HIRED: 'STATUS_UPDATE_HIRED',
  STATUS_UPDATE_REJECTED: 'STATUS_UPDATE_REJECTED',
  // Employer notifications
  NEW_APPLICANT: 'NEW_APPLICANT'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// Notification Response DTO từ backend
export interface NotificationResponseDto {
  id: number;
  notificationType: string | null; // String từ backend: APPLY_SUCCESS, NEW_APPLICANT, etc.
  title: string;
  message: string;
  status: string | null; // String từ backend: PENDING, CV_PASSED, INTERVIEW, HIRED, REJECTED
  isRead: boolean;
  createdAt: string; // ISO datetime string
  applicantId: number | null;
  jobTitle: string;
  companyName: string | null;
}

// Paginated Response cho danh sách thông báo
export interface NotificationPaginatedResponse {
  notifications: NotificationResponseDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Response cho unread notifications (⭐ Giờ có pagination)
export interface UnreadNotificationsResponse {
  notifications: NotificationResponseDto[];
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

// Response cho unread count
export interface UnreadCountResponse {
  unreadCount: number;
}

// Mark as read response
export interface MarkAsReadResponse {
  message: string;
}

// Query params cho pagination
export interface NotificationQueryParams {
  page?: number;
  size?: number;
}
