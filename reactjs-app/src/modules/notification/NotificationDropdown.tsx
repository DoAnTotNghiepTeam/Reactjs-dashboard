// NotificationDropdown.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  UserCheck,
  Building2,
  Briefcase,
  ArrowRight,
  Loader2
} from "lucide-react";
import { notificationService } from "../../services/notification.service";
import { formatNotificationTime } from "../../utils/notificationHelpers";
import { Link } from "react-router";
import type { NotificationResponseDto } from "../../types/notification.type";
import { useEffect } from "react";
import styles from "./NotificationDropdown.module.css";

export default function NotificationDropdown() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch unread count
  const { data: unreadData, error: unreadError, isLoading: isLoadingCount } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      // console.log('🔔 Fetching unread count...'); // DEBUG: Kiểm tra khi nào fetch unread count
      const result = await notificationService.getUnreadCount();
      // console.log('✅ Unread count result:', result); // DEBUG: Xem kết quả API trả về unread count
      return result;
    },
    refetchInterval: 30000, // Refresh mỗi 30s
  });

  // Fetch TẤT CẢ notifications (cả đã đọc và chưa đọc) để hiển thị trong dropdown
  const { data: notificationsData, error: notificationsError, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: async () => {
      // console.log('🔔 Fetching all notifications...'); // DEBUG: Kiểm tra khi nào fetch danh sách notifications
      const result = await notificationService.getNotifications({ page: 0, size: 15 });
      // console.log('✅ All notifications result:', result); // DEBUG: Xem danh sách notifications API trả về
      return result;
    },
    refetchInterval: 30000, // Refresh mỗi 30s
  });

  // Mutation: đánh dấu 1 thông báo đã đọc khi click vào notification
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = unreadData?.unreadCount || 0;
  const notifications = notificationsData?.notifications || [];
  
  // Tính unreadCount từ notifications array nếu API không trả về
  const actualUnreadCount = unreadCount > 0 ? unreadCount : notifications.filter(n => !n.isRead).length;

  // Debug logging - Theo dõi state thay đổi của notification component
  useEffect(() => {
    // console.log('📊 Notification State Updated:', { // DEBUG: Xem tổng quan state notification sau mỗi lần update
    //   unreadCount: actualUnreadCount,
    //   notificationsCount: notifications.length,
    //   isLoadingCount,
    //   isLoadingNotifications,
    //   hasUnreadError: !!unreadError,
    //   hasNotificationsError: !!notificationsError,
    //   unreadData,
    //   notificationsData,
    // });
  }, [actualUnreadCount, notifications, isLoadingCount, isLoadingNotifications, unreadError, notificationsError]);

  // ✅ Listen event để refetch notifications khi employer update status
  useEffect(() => {
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
    };

    window.addEventListener('refreshNotifications', handleRefresh);
    return () => window.removeEventListener('refreshNotifications', handleRefresh);
  }, [queryClient]);

  // DEBUG: Hiển thị lỗi khi fetch API thất bại
  // if (unreadError) {
  //   console.error('❌ Unread count error:', unreadError); // DEBUG: Lỗi khi fetch unread count
  // }
  // if (notificationsError) {
  //   console.error('❌ Notifications error:', notificationsError); // DEBUG: Lỗi khi fetch notifications list
  // }

  // Helper functions
  const getStatusIcon = (status: string | null, notificationType: string | null) => {
    if (status === 'HIRED') return <CheckCircle className={styles.statusIcon} />;
    if (status === 'REJECTED') return <AlertCircle className={styles.statusIcon} />;
    if (status === 'INTERVIEW') return <Calendar className={styles.statusIcon} />;
    if (status === 'CV_PASSED') return <UserCheck className={styles.statusIcon} />;
    if (status === 'PENDING') return <Clock className={styles.statusIcon} />;
    if (notificationType === 'NEW_APPLICANT') return <Bell className={styles.statusIcon} />;
    return <CheckCircle className={styles.statusIcon} />;
  };

  const getStatusClassName = (status: string | null) => {
    const baseClass = styles.notifStatus;
    if (status === 'HIRED') return `${baseClass} ${styles.hired}`;
    if (status === 'REJECTED') return `${baseClass} ${styles.rejected}`;
    if (status === 'INTERVIEW') return `${baseClass} ${styles.interview}`;
    if (status === 'CV_PASSED') return `${baseClass} ${styles.cvPassed}`;
    if (status === 'PENDING') return `${baseClass} ${styles.pending}`;
    return baseClass;
  };

  const getStatusText = (status: string | null) => {
    if (status === 'HIRED') return 'Trúng tuyển';
    if (status === 'REJECTED') return 'Từ chối';
    if (status === 'INTERVIEW') return 'Mời phỏng vấn';
    if (status === 'CV_PASSED') return 'CV đạt yêu cầu';
    if (status === 'PENDING') return 'Đang xét duyệt';
    return status;
  };

  // Handler khi click vào notification item (giống NextJS code)
  const handleNotificationClick = (notification: NotificationResponseDto) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Đợi 200ms để animation chạy rồi mới navigate
    setTimeout(() => {
      if (notification.jobId) {
        // Navigate đến trang danh sách applicants của job đó
        navigate(`/employerjob/jobs/${notification.jobId}/applicants`);
      }
    }, 200);
  };

  return (
    <div className={styles.notificationWrapper}>
      <Menu as="div" className={styles.notificationWrapper}>
        <Menu.Button className={styles.bellButton}>
          <Bell size={22} />
          {actualUnreadCount > 0 && (
            <span className={styles.badge}>
              {actualUnreadCount > 99 ? '99+' : actualUnreadCount}
            </span>
          )}
        </Menu.Button>

        <Menu.Items className={styles.dropdown}>
          {/* Header */}
          <div className={styles.header}>
            <h3>Thông báo</h3>
            {actualUnreadCount > 0 && (
              <span className={styles.unreadText}>
                {actualUnreadCount} chưa đọc
              </span>
            )}
          </div>

          {/* Notifications list */}
          <div className={styles.notificationList}>
            {isLoadingNotifications ? (
              <div className={styles.loading}>
                <Loader2 className={styles.loadingSpinner} />
                <span>Đang tải...</span>
              </div>
            ) : notificationsError ? (
              <div className={styles.empty}>
                <AlertCircle className={styles.emptyIcon} />
                <p>Lỗi khi tải thông báo</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell className={styles.emptyIcon} />
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.slice(0, 15).map((notification: NotificationResponseDto) => (
                <Menu.Item key={notification.id}>
                  {({ close }) => (
                    <div
                      className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                      onClick={() => {
                        handleNotificationClick(notification);
                        close();
                      }}
                    >
                      <div className={styles.notifContent}>
                        <div className={styles.notifTitle}>
                          <span className={styles.notifTitleText}>{notification.title}</span>
                          {!notification.isRead && <span className={styles.newDot}>●</span>}
                        </div>

                        {/* Company name */}
                        {notification.companyName && (
                          <div className={styles.companyName}>
                            <Building2 className={styles.companyIcon} />
                            {notification.companyName}
                          </div>
                        )}

                        {/* Job title */}
                        {notification.jobTitle && (
                          <div className={styles.notifJob}>
                            <Briefcase className={styles.briefcaseIcon} />
                            {notification.jobTitle}
                          </div>
                        )}

                        {/* Message */}
                        {notification.message && (
                          <div className={styles.notifMessage}>
                            {notification.message}
                          </div>
                        )}

                        {/* Footer: Status + Time */}
                        <div className={styles.notifFooter}>
                          {notification.status && notification.status !== 'PENDING' && (
                            <span className={getStatusClassName(notification.status)}>
                              {getStatusIcon(notification.status, notification.notificationType)}
                              {getStatusText(notification.status)}
                            </span>
                          )}
                          <span className={styles.notifTime}>
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))
            )}
          </div>

          {/* Footer: View all link */}
          <Link to="/employerjob" className={styles.viewAll} onClick={() => {
            // Close menu when clicking link
            const menuButton = document.querySelector(`[aria-expanded="true"]`) as HTMLElement;
            menuButton?.click();
          }}>
            Xem tất cả đơn ứng tuyển
            <ArrowRight className={styles.arrowIcon} />
          </Link>
        </Menu.Items>
      </Menu>
    </div>
  );
}
