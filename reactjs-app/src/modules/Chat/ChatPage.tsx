import React, { useState } from "react";
import SidebarApplicants from "./SidebarApplicants";
import ChatBox from "./ChatBox";
import { useAuthStore } from "../../stores/useAuthorStore";

const ChatPage: React.FC = () => {
  // Lấy user ID từ auth store - QUAN TRỌNG cho bảo mật
  const loggedInUser = useAuthStore((state) => state.loggedInUser);
  const employerId = loggedInUser?.id ? String(loggedInUser.id) : null;
  
  // Kiểm tra xem user đã đăng nhập chưa
  if (!employerId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 120px)',
        background: '#f8fafc',
        padding: 20
      }}>
        <div style={{
          textAlign: 'center',
          background: '#ffffff',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
            Vui lòng đăng nhập để sử dụng chat
          </div>
        </div>
      </div>
    );
  }

  // selectedApplicant holds both id and optional name
  const [selectedApplicant, setSelectedApplicant] = useState<{ applicantId: string; applicantName?: string } | null>(null);
  // chatId là kết hợp employerId và applicantId - đảm bảo mỗi employer có chat riêng
  const chatId = selectedApplicant ? `${employerId}_${selectedApplicant.applicantId}` : "";

  return (
    <div style={{
      display: "flex",
      gap: 16,
      height: "calc(100vh - 120px)",
      background: "#f8fafc",
      padding: 20,
      minHeight: 600
    }}>
      <div style={{ 
        width: 360, 
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden'
      }}>
        <SidebarApplicants employerId={employerId} onSelectApplicant={setSelectedApplicant} />
      </div>
      <div style={{ 
        flex: 1, 
        height: '100%',
        overflow: 'hidden'
      }}>
        {selectedApplicant ? (
          <ChatBox chatId={chatId} currentUserId={employerId} initialApplicantName={selectedApplicant.applicantName} />
        ) : (
          <div style={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Chọn ứng viên để bắt đầu chat</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;