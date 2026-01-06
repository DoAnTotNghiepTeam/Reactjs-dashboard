# 🔔 Notification System - Quick Reference

## 🆕 Thay đổi từ backend (Updated)

### 1. **NotificationType Enum** (MỚI)
```typescript
enum NotificationType {
  // Candidate
  APPLY_SUCCESS           // ✅ Ứng tuyển thành công
  STATUS_UPDATE_PASSED    // ✅ CV được duyệt
  STATUS_UPDATE_INTERVIEW // 📅 Mời phỏng vấn
  STATUS_UPDATE_HIRED     // 🎉 Được tuyển dụng
  STATUS_UPDATE_REJECTED  // ❌ Bị từ chối
  
  // Employer  
  NEW_APPLICANT          // 🔔 Có ứng viên mới
}
```

### 2. **API Endpoints - Thay đổi**

| Endpoint | Method | Changes |
|----------|--------|---------|
| `/api/notifications/unread` | GET | ⭐ Giờ nhận `?page=0&size=20` |
| `/api/notifications/{id}` | DELETE | ⭐ MỚI - Soft delete |

### 3. **Response DTO - Thêm field**
```typescript
interface NotificationResponseDto {
  id: number;
  notificationType: string;  // ⭐ MỚI
  title: string;
  message: string;
  status: string | null;
  isRead: boolean;
  createdAt: string;
  applicantId: number | null;
  jobTitle: string;
  companyName: string | null;
}
```

### 4. **UnreadNotificationsResponse - Thêm pagination**
```typescript
interface UnreadNotificationsResponse {
  notifications: NotificationResponseDto[];
  unreadCount: number;
  currentPage: number;      // ⭐ MỚI
  totalPages: number;       // ⭐ MỚI
  hasNext: boolean;         // ⭐ MỚI
}
```

## 📦 Files đã cập nhật

### ✅ Types
- [x] `notification.type.ts` - Thêm `NotificationType` enum
- [x] `notification.type.ts` - Thêm field `notificationType` vào DTO
- [x] `notification.type.ts` - Cập nhật `UnreadNotificationsResponse` với pagination

### ✅ Services
- [x] `notification.service.ts` - `getUnreadNotifications()` giờ nhận `params`
- [x] `notification.service.ts` - Thêm `deleteNotification(id)`

### ✅ Components
- [x] `NotificationPage.tsx` - Thêm nút xóa thông báo
- [x] `NotificationPage.tsx` - Thêm `deleteNotificationMutation`
- [x] `NotificationDropdown.tsx` - Cập nhật call API với pagination

### ✅ Utils
- [x] `notificationHelpers.tsx` - Thêm `getNotificationTypeIcon()`

## 🎯 Tính năng mới

### 1. **Soft Delete Notification**
```tsx
// User có thể xóa thông báo
const handleDelete = (id: number) => {
  if (confirm("Bạn có chắc muốn xóa?")) {
    deleteNotificationMutation.mutate(id);
  }
};
```

### 2. **Pagination cho Unread**
```tsx
// Dropdown chỉ load 10 thông báo mới nhất
notificationService.getUnreadNotifications({ page: 0, size: 10 })
```

### 3. **NotificationType Icons**
```tsx
APPLY_SUCCESS           → ✅
STATUS_UPDATE_PASSED    → ✅
STATUS_UPDATE_INTERVIEW → 📅
STATUS_UPDATE_HIRED     → 🎉
STATUS_UPDATE_REJECTED  → ❌
NEW_APPLICANT           → 🔔
```

## 🔄 Migration từ version cũ

### API Calls
```typescript
// CŨ
getUnreadNotifications: async () => {
  return await apiClient.get('/api/notifications/unread');
}

// MỚI
getUnreadNotifications: async (params = { page: 0, size: 20 }) => {
  return await apiClient.get('/api/notifications/unread', { params });
}
```

### Response Handling
```typescript
// CŨ
const { notifications, unreadCount } = response;

// MỚI
const { 
  notifications, 
  unreadCount, 
  currentPage,    // ⭐
  totalPages,     // ⭐
  hasNext         // ⭐
} = response;
```

## 🧪 Testing

### Test Soft Delete
1. Vào `/notifications`
2. Click nút 🗑️ bên cạnh thông báo
3. Confirm xóa
4. Thông báo biến mất (soft deleted trong DB)

### Test Pagination Unread
1. Tạo > 10 thông báo chưa đọc
2. Mở dropdown
3. Chỉ thấy 10 thông báo mới nhất
4. Check backend: `deletedAt IS NULL AND isRead = false`

### Test NotificationType
1. Apply job → Check `notificationType: 'APPLY_SUCCESS'`
2. Employer update CV_PASSED → Check `notificationType: 'STATUS_UPDATE_PASSED'`
3. UI hiển thị icon tương ứng

## 🎨 UI Changes

### Notification List
```
┌─────────────────────────────────────────┐
│ ✅ Ứng tuyển thành công           👁️ 🗑️ │
│ Company A - 2h trước                     │
│ [PENDING]                                │
├─────────────────────────────────────────┤
│ 🔔 Có ứng viên mới                   🗑️ │
│ Nguyễn Văn A - Frontend Dev - 5h        │
│ [PENDING]                                │
└─────────────────────────────────────────┘
```

## 📊 Performance Improvements

1. **N+1 Query Fix** ✅
   - Backend dùng `JOIN FETCH` để eager load `applicant`
   
2. **Pagination Unread** ✅
   - Không load toàn bộ unread, chỉ load 10-20 mới nhất
   
3. **Soft Delete** ✅
   - Query tự động filter `deletedAt IS NULL`
   - Index: `idx_deleted_at`

4. **Authorization Check** ✅
   - Mọi action đều check ownership qua `userId`

## 🚨 Breaking Changes

### ⚠️ QUAN TRỌNG
1. **getUnreadNotifications()** giờ yêu cầu params (có default)
2. Response trả về thêm pagination fields
3. DTO thêm field `notificationType`

### Migration Code
```typescript
// Nếu code cũ gọi như này:
const data = await notificationService.getUnreadNotifications();

// Vẫn work vì có default params { page: 0, size: 20 }
// Nhưng nên update thành:
const data = await notificationService.getUnreadNotifications({ 
  page: 0, 
  size: 10 
});
```

## ✅ Checklist

- [x] Types updated với NotificationType
- [x] Service updated với pagination & delete
- [x] NotificationPage hỗ trợ xóa
- [x] NotificationDropdown dùng pagination
- [x] Helper functions cho NotificationType
- [x] Error handling cho soft delete
- [x] Loading states
- [x] Confirm dialogs

## 🎉 Kết quả

Hệ thống notification đã được cập nhật hoàn chỉnh theo backend mới với:
- ✅ Soft delete support
- ✅ Pagination cho unread
- ✅ NotificationType enum
- ✅ Performance improvements
- ✅ Better authorization

Tất cả thay đổi đều backward compatible và không breaking existing code!
