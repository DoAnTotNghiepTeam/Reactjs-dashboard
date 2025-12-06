# 📚 HR Dashboard – User Stories

> **Tập hợp các chức năng điều hướng và tính năng chính dành cho người dùng nhà tuyển dụng (HR) trong dashboard.**

---

## 🧩 User Story #1: Quản lý hồ sơ công ty

**User Story**:  
_As a company user, I want to view and update my company profile, so that candidates can access accurate and professional information about the organization._

### ✅ Acceptance Criteria:

#### 📌 1. Company Details

- Hiển thị và cho phép chỉnh sửa các thông tin cơ bản:
  - Company Logo
  - Company Name
  - Email Address
  - Phone
  - Website
  - Est. Since (năm thành lập)
  - Team Size (quy mô nhân sự)
  - Multiple Select Boxes (lĩnh vực, ngành nghề liên quan)
  - Tuỳ chọn: **"Allow In Search & Listing"**
  - About Company (mô tả chi tiết về công ty)
- Các trường bắt buộc cần được đánh dấu rõ ràng (\*) và hiển thị lỗi nếu bỏ trống hoặc sai định dạng
- Nút **“Save”** để lưu thay đổi và hiển thị thông báo khi thành công

#### 📌 2. Social Network

- Hiển thị và cập nhật liên kết mạng xã hội:
  - Facebook
  - Twitter
  - LinkedIn
  - Google Plus
- Cho phép để trống, nhưng nếu nhập phải đúng định dạng URL

#### 📌 3. Contact Information

- Cho phép chỉnh sửa:
  - Country (quốc gia)
  - City (thành phố)
  - Complete Address (địa chỉ cụ thể)
  - Find On Map (mở bản đồ tương tác)
  - Latitude & Longitude (tự động cập nhật từ bản đồ hoặc nhập thủ công)

> **Priority**: High  **Story Points**: 3  
> **UI Design**: Company Profile Page – Employers Dashboard

---

## 🧩 User Story #2: Đăng tin tuyển dụng mới

**User Story**:  
_As a company user, I want to create and publish a new job post, so that I can attract applicants for current openings._

### ✅ Acceptance Criteria:

- Nhập được các trường:
  - Job Title, Job Description, Email Address, Username
  - Specialisms, Job Type, Offered Salary
  - Career Level, Experience, Gender
  - Industry, Qualification
  - Application Deadline Date
  - Country, City, Complete Address
- Nếu thiếu trường bắt buộc → hiển thị lỗi
- Có nút **“Đăng tin”** và hiển thị thông báo sau khi thành công
- Chuyển hướng về **trang quản lý tin**
- Cho phép **xem trước** tin trước khi đăng

> **Priority**: High  **Story Points**: 5  
> **UI Design**: Post a New Job Page – Employers Dashboard

---

## 🧩 User Story #3: Quản lý tin tuyển dụng

**User Story**:  
_As a company user, I want to view and manage my posted job listings, so that I can track applications, update job details, or remove listings as needed._

### ✅ Acceptance Criteria:

- Hiển thị danh sách tin đã đăng gồm:
  - Job Title
  - Company Logo
  - Company Name
  - Location
  - Created & Expired Date
  - Status: **Active**, **Hidden**, **Expired**
  - Applications (số ứng viên nộp hồ sơ)
- Các hành động với từng tin:
  - 👁 cho phép xem chi tiết
  - ✏️ Chỉnh sửa tin tuyển dụng
  - 🗑 Xóa (kèm hộp thoại xác nhận) tin tuyển dụng
- Nhấn vào số ứng viên để xem danh sách ứng tuyển
- Tìm kiếm theo **Job Title**
- Tin sắp xếp theo **thời gian đăng** (mới → cũ)
- Tất cả thao tác đều có thông báo rõ ràng

> **Priority**: High  **Story Points**: 4  
> **UI Design**: Manage Jobs Page – Employers Dashboard

---

## 🧩 User Story #4: Xem danh sách ứng viên

**User Story**:  
_As a company user, I want to browse and manage applicants for my posted jobs, so that I can review, approve, reject, or delete applications efficiently._

### ✅ Acceptance Criteria:

- Hiển thị danh sách ứng viên theo từng job:
  - Job Title
  - Tổng số ứng viên
  - Số lượng **Approved / Rejected**
- Với mỗi ứng viên:
  - Avatar
  - Họ tên
  - Job Role
  - Location
  - Mức lương kỳ vọng ($/hour)
  - Skills / Tags
- Hành động:
  - 👁 Xem chi tiết
  - ✅ Duyệt
  - ❌ Từ chối
  - 🗑 Xóa
- Bộ lọc:
  - Chọn theo Job
  - Trạng thái: **All / Approved / Rejected / Pending**
- Hiển thị thông báo phản hồi sau thao tác

> **Priority**: Medium  **Story Points**: 3  
> **UI Design**: All Applicants Page – Employers Dashboard

---

## 🧩 User Story #5: Danh sách hồ sơ chọn lọc

**User Story**:  
_As a company user, I want to view my shortlisted candidates, so that I can focus on the most promising applicants._

### ✅ Acceptance Criteria:

- Người dùng có thể **Shortlist** ứng viên ✅
- Có **trang riêng** cho danh sách shortlisted
- Hiển thị:
  - Avatar, Họ tên
  - Job Role, Location
  - Expected Salary, Skills
  - 👁 Xem | ❌ Bỏ chọn | 🗑 Xoá
- Tìm kiếm theo **tên ứng viên**
- Bộ lọc **thời gian shortlist**: Mới nhất / Cũ nhất
- Bỏ shortlist → ứng viên quay về danh sách gốc
- Danh sách được **lưu (persisted)**

> **Priority**: Medium  **Story Points**: 2  
> **UI Design**: Shortlisted Resumes Page – Employers Dashboard

---

## 🧩 User Story #6: Nhắn tin với ứng viên

**User Story**:  
_As a company user, I want to message candidates, so that I can communicate and coordinate interviews._

### ✅ Acceptance Criteria:

- Có thể mở mục **tin nhắn riêng** với từng ứng viên
- Gửi và nhận tin nhắn trong giao diện
- Hiển thị **thời gian**, **đã đọc / chưa đọc**
- Thông báo khi có **tin nhắn mới**

> **Priority**: Medium  **Story Points**: 4  
> **UI Design**: Messages Page – Employers Dashboard

---

## 🧩 User Story #7: Đổi mật khẩu

**User Story**:  
_As a company user, I want to change my password, so that I can protect my account and ensure privacy._

### ✅ Acceptance Criteria:

- Phải nhập **mật khẩu cũ**
- Mật khẩu mới tối thiểu **8 ký tự + ký tự đặc biệt**
- Nhập sai mật khẩu cũ → hiển thị lỗi
- Đổi thành công → hiển thị thông báo, có thể yêu cầu đăng nhập lại

> **Priority**: Medium  **Story Points**: 2  
> **UI Design**: Change Password Page – Employers Dashboard

---

## 🧩 User Story #8: Đăng xuất

**User Story**:  
_As a company user, I want to log out of my account, so that I can ensure security after completing tasks._

### ✅ Acceptance Criteria:

- Nút **“Đăng xuất”** hiển thị rõ trong sidebar
- Nhấn để đăng xuất → chuyển về trang login
- Xoá dữ liệu phiên đăng nhập

> **Priority**: High  **Story Points**: 1  
> **UI Design**: Logout Item – Sidebar
