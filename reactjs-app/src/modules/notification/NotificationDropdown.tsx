// NotificationDropdown.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu } from "@headlessui/react";
import { Bell, CheckCheck, Eye } from "lucide-react";
import { notificationService } from "../../services/notification.service";
import { formatNotificationTime, getStatusBadgeInfo } from "../../utils/notificationHelpers";
import { Link } from "react-router";
import type { NotificationResponseDto } from "../../types/notification.type";

export default function NotificationDropdown() {
  const queryClient = useQueryClient();

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000, // Refresh mỗi 30s
  });

  // Fetch unread notifications (giờ có pagination)
  const { data: notificationsData } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => notificationService.getUnreadNotifications({ page: 0, size: 10 }),
  });

  // Mutation: đánh dấu 1 thông báo đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation: đánh dấu tất cả đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = unreadData?.unreadCount || 0;
  const notifications = notificationsData?.notifications || [];

  const handleMarkAsRead = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAllAsReadMutation.mutate();
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative">
        <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">Thông báo ({unreadCount})</span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs hover:underline flex items-center gap-1"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck className="w-4 h-4" />
              Đọc tất cả
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không có thông báo mới</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.slice(0, 5).map((notification: NotificationResponseDto) => (
                <Menu.Item key={notification.id}>
                  {({ close }) => (
                    <li
                      className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={close}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900 line-clamp-1">
                              {notification.title}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-700 line-clamp-2 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatNotificationTime(notification.createdAt)}</span>
                            {notification.status && (
                              <span className={`px-2 py-0.5 rounded text-xs border ${
                                getStatusBadgeInfo(notification.status)?.className || 'bg-gray-100'
                              }`}>
                                {getStatusBadgeInfo(notification.status)?.label || notification.status}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition flex-shrink-0"
                            title="Đánh dấu đã đọc"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </li>
                  )}
                </Menu.Item>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200">
          <Link
            to="/notifications"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Xem tất cả thông báo →
          </Link>
        </div>
      </Menu.Items>
    </Menu>
  );
}
