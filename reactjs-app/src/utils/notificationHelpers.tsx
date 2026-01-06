// utils/notificationHelpers.tsx
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format thời gian thành dạng relative (vd: "2 giờ trước")
 */
export const formatNotificationTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return dateString;
  }
};

/**
 * Lấy icon cho NotificationType
 */
export const getNotificationTypeIcon = (type: string | null): string => {
  if (!type) return '📢';
  
  const iconMap: Record<string, string> = {
    APPLY_SUCCESS: '✅',
    STATUS_UPDATE_PASSED: '✅',
    STATUS_UPDATE_INTERVIEW: '📅',
    STATUS_UPDATE_HIRED: '🎉',
    STATUS_UPDATE_REJECTED: '❌',
    NEW_APPLICANT: '🔔',
  };

  return iconMap[type] || '📢';
};

/**
 * Lấy thông tin hiển thị cho status badge
 */
export const getStatusBadgeInfo = (
  status: string | null
): { label: string; className: string } | null => {
  if (!status) return null;

  const statusMap: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Chờ xử lý',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    CV_PASSED: {
      label: 'CV đã duyệt',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    INTERVIEW: {
      label: 'Phỏng vấn',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    HIRED: {
      label: 'Đã tuyển',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    REJECTED: {
      label: 'Từ chối',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  return (
    statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    }
  );
};

/**
 * Lấy icon emoji cho từng loại status
 */
export const getStatusIcon = (status: string | null): string => {
  const iconMap: Record<string, string> = {
    PENDING: '⏳',
    CV_PASSED: '✅',
    INTERVIEW: '📅',
    HIRED: '🎉',
    REJECTED: '❌',
  };

  return status ? iconMap[status] || '📢' : '📢';
};

/**
 * Render status badge component
 */
export const StatusBadge = ({ status }: { status: string | null }) => {
  const badgeInfo = getStatusBadgeInfo(status);
  if (!badgeInfo) return null;

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium border ${badgeInfo.className}`}
    >
      {getStatusIcon(status)} {badgeInfo.label}
    </span>
  );
};
