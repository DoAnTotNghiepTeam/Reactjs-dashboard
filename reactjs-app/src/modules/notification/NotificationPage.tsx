// NotificationPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services/notification.service";
import type { NotificationResponseDto } from "../../types/notification.type";
import { Bell, CheckCheck, Eye, Trash2 } from "lucide-react";
import { formatNotificationTime, StatusBadge } from "../../utils/notificationHelpers";

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Fetch notifications với phân trang
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationService.getNotifications({ page, size: pageSize }),
  });

  // Mutation: đánh dấu 1 thông báo đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  // Mutation: đánh dấu tất cả đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  // Mutation: xóa thông báo (soft delete) ⭐ MỚI
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: number) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    if (confirm("Đánh dấu tất cả thông báo đã đọc?")) {
      markAllAsReadMutation.mutate();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
      deleteNotificationMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg m-4">
        Lỗi khi tải thông báo: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <CheckCheck className="w-5 h-5" />
          {markAllAsReadMutation.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
        </button>
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {data?.notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Chưa có thông báo nào</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data?.notifications.map((notification: NotificationResponseDto) => (
              <li
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        📅 {formatNotificationTime(notification.createdAt)}
                      </span>
                      {notification.jobTitle && (
                        <span>📋 {notification.jobTitle}</span>
                      )}
                      {notification.companyName && (
                        <span>🏢 {notification.companyName}</span>
                      )}
                    </div>
                    
                    {notification.status && (
                      <div className="mt-2">
                        <StatusBadge status={notification.status} />
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Đánh dấu đã đọc"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!data.hasPrevious}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trang trước
          </button>
          
          <span className="text-gray-700">
            Trang {data.currentPage + 1} / {data.totalPages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={!data.hasNext}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
