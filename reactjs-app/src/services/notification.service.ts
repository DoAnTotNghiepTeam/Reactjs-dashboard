// notification.service.ts
import apiClient from '../libs/api-client';
import {
  NotificationPaginatedResponse,
  NotificationQueryParams,
  UnreadNotificationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse
} from '../types/notification.type';

const NOTIFICATION_BASE_URL = '/notifications';

export const notificationService = {
  /**
   * Lấy danh sách thông báo có phân trang
   * GET /api/notifications?page=0&size=10
   */
  getNotifications: async (params: NotificationQueryParams = { page: 0, size: 10 }) => {
    const response = await apiClient.get<NotificationPaginatedResponse>(
      NOTIFICATION_BASE_URL,
      { params }
    );
    // apiClient đã return response.data rồi, không cần .data nữa
    return response as any as NotificationPaginatedResponse;
  },

  /**
   * Lấy danh sách thông báo chưa đọc (⭐ Giờ có pagination)
   * GET /api/notifications/unread?page=0&size=20
   */
  getUnreadNotifications: async (params: NotificationQueryParams = { page: 0, size: 20 }) => {
    const response = await apiClient.get<UnreadNotificationsResponse>(
      `${NOTIFICATION_BASE_URL}/unread`,
      { params }
    );
    return response as any as UnreadNotificationsResponse;
  },

  /**
   * Đếm số thông báo chưa đọc
   * GET /api/notifications/unread-count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get<UnreadCountResponse>(
      `${NOTIFICATION_BASE_URL}/unread-count`
    );
    return response as any as UnreadCountResponse;
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   * PUT /api/notifications/{id}/read
   */
  markAsRead: async (notificationId: number) => {
    const response = await apiClient.put<MarkAsReadResponse>(
      `${NOTIFICATION_BASE_URL}/${notificationId}/read`
    );
    return response as any as MarkAsReadResponse;
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   * PUT /api/notifications/mark-all-read
   */
  markAllAsRead: async () => {
    const response = await apiClient.put<MarkAsReadResponse>(
      `${NOTIFICATION_BASE_URL}/mark-all-read`
    );
    return response as any as MarkAsReadResponse;
  },

  /**
   * Xóa mềm một thông báo (⭐ MỚI)
   * DELETE /api/notifications/{id}
   */
  deleteNotification: async (notificationId: number) => {
    const response = await apiClient.delete<MarkAsReadResponse>(
      `${NOTIFICATION_BASE_URL}/${notificationId}`
    );
    return response as any as MarkAsReadResponse;
  },
};
