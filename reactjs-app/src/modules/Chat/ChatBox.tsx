import React, { useEffect, useState } from "react";
import type { DocumentData, Timestamp } from "firebase/firestore";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "./libraries/firebase/initializaApp";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp?: Timestamp | null;
}

interface ChatBoxProps {
  chatId: string;
  currentUserId: string;
  initialApplicantName?: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId, currentUserId, initialApplicantName = null }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [applicantName, setApplicantName] = useState<string | null>(null);
  const [maybeApplicantId, setMaybeApplicantId] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // if parent provides an initial applicant name (from sidebar), use it immediately
  // we'll prefer the prop over the summary snapshot when rendering

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Message[] = snapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        senderId: doc.data().senderId,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
      }));
      setMessages(list);
      setTimeout(scrollToBottom, 100);
    });
    return () => unsubscribe();
  }, [chatId, initialApplicantName]);

  // subscribe to chat summary document to get applicant's display name
  useEffect(() => {
    if (!chatId) return;
    const summaryRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(summaryRef, (snap) => {
      const data = snap.data() as DocumentData | undefined;
      console.debug('[ChatBox] summary snapshot', { chatId, data, initialApplicantName });
      if (data) {
        // prefer the summary value but keep initial prop if set
        setApplicantName(data.applicantName ?? initialApplicantName ?? null);
        setMaybeApplicantId(data.applicantId ?? null);
      } else {
        // fallback: try to infer from chatId pattern
        const parts = chatId.split("_");
        setMaybeApplicantId(parts[1] ?? null);
        setApplicantName(initialApplicantName ?? null);
      }
    });
    return () => unsubscribe();
  }, [chatId, initialApplicantName]);

  // sync when parent-provided initial name changes
  useEffect(() => {
    if (initialApplicantName) setApplicantName(initialApplicantName);
  }, [initialApplicantName]);

  // const sendMessage = async () => {
  //   if (!input.trim()) return;
  //   await addDoc(collection(db, "chats", chatId, "messages"), {
  //     senderId: currentUserId,
  //     text: input,
  //     timestamp: serverTimestamp(),
  //   });
  //   // ensure the chat summary exists and is updated
  //   // parse employerId/applicantId from chatId if chatId was generated as `${employer}_${applicant}`
  //   const parts = chatId.split("_");
  //   const maybeEmployerId = parts[0] ?? null;
  //   const maybeApplicantId = parts[1] ?? null;
  //   // Xác định phía nhận để set unread
  //   // Nếu currentUserId là employer thì unread cho ứng viên, ngược lại cho employer
  //   const unreadFor = currentUserId === maybeEmployerId ? 'applicant' : 'employer';
  //   await setDoc(doc(db, "chats", chatId), {
  //     employerId: maybeEmployerId ? String(maybeEmployerId) : "",
  //     applicantId: maybeApplicantId ? String(maybeApplicantId) : "",
  //     applicantName: applicantName || String(maybeApplicantId),
  //     lastMessage: input,
  //     lastTimestamp: serverTimestamp(),
  //     unread: unreadFor === 'employer' ? true : true // luôn set true, Sidebar sẽ tự xử lý phía hiển thị
  //   }, { merge: true });
  //   setInput("");
  // };
  
  const sendMessage = async () => {
  if (!input.trim()) return;
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId: currentUserId,
    text: input,
    timestamp: serverTimestamp(),
  });
  
  const parts = chatId.split("_");
  const maybeEmployerId = parts[0] ?? null;
  const maybeApplicantId = parts[1] ?? null;
  
  // Xác định ai gửi
  const isEmployerSending = currentUserId === maybeEmployerId;
  
  await setDoc(doc(db, "chats", chatId), {
    employerId: maybeEmployerId ? String(maybeEmployerId) : "",
    applicantId: maybeApplicantId ? String(maybeApplicantId) : "",
    applicantName: applicantName || String(maybeApplicantId),
    lastMessage: input,
    lastTimestamp: serverTimestamp(),
    // Nếu employer gửi → unread cho applicant, ngược lại unread cho employer
    unreadForApplicant: isEmployerSending,
    unreadForEmployer: !isEmployerSending
  }, { merge: true });
  
  setInput("");
};

  // Format time for messages
  const formatMessageTime = (timestamp?: Timestamp | null) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    
    // Check if message is from today
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      // Only show time for today's messages
      return date.toLocaleString('vi-VN', { 
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // Show date for messages from previous days
      return date.toLocaleString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Avatar cho 2 phía
  const avatar = (isUser: boolean) => (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', 
      background: isUser ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, 
      color: '#fff', fontSize: 20,
      margin: isUser ? '0 0 0 10px' : '0 10px 0 0', flexShrink: 0,
      boxShadow: isUser ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(139, 92, 246, 0.3)'
    }}>
      <span role="img" aria-label="avatar">{isUser ? '🧑‍💼' : '👤'}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: "2px solid #e2e8f0", 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 20, flexShrink: 0,
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
        }}>
          <span role="img" aria-label="avatar">👤</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b' }}>
            {applicantName || maybeApplicantId || "(Không rõ)"}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Ứng viên</div>
        </div>
      </div>
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: '20px 16px', 
        background: '#fafbfc',
        backgroundImage: 'radial-gradient(circle at 20px 20px, #f1f5f9 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center', 
            color: '#94a3b8', 
            marginTop: 80, 
            fontSize: 16,
            fontWeight: 500
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            Chưa có tin nhắn nào
          </div>
        )}
        {messages.map((msg, index) => {
          const isUser = msg.senderId === currentUserId;
          const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
          
          return (
            <div key={msg.id} style={{
              display: 'flex', 
              flexDirection: isUser ? 'row-reverse' : 'row', 
              alignItems: 'flex-end', 
              marginBottom: showAvatar ? 16 : 6,
              paddingLeft: !isUser && !showAvatar ? 50 : 0
            }}>
              {!isUser && showAvatar && (
                <div style={{ width: 40, flexShrink: 0, margin: '0 10px 0 0' }}>
                  {avatar(isUser)}
                </div>
              )}
              <div style={{ maxWidth: '65%', minWidth: 80 }}>
                {showAvatar && (
                  <div style={{ 
                    fontSize: 13, 
                    color: '#64748b', 
                    marginBottom: 6, 
                    textAlign: isUser ? 'right' : 'left', 
                    fontWeight: 600,
                    paddingLeft: isUser ? 0 : 4,
                    paddingRight: isUser ? 4 : 0
                  }}>
                    {isUser ? 'Bạn' : (applicantName || maybeApplicantId || msg.senderId)}
                  </div>
                )}
                <div style={{
                  background: isUser 
                    ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' 
                    : '#ffffff',
                  color: isUser ? '#ffffff' : '#1e293b',
                  padding: '12px 16px',
                  borderRadius: 18,
                  borderTopRightRadius: isUser ? (showAvatar ? 18 : 6) : 18,
                  borderTopLeftRadius: isUser ? 18 : (showAvatar ? 18 : 6),
                  borderBottomRightRadius: isUser ? 6 : 18,
                  borderBottomLeftRadius: isUser ? 18 : 6,
                  boxShadow: isUser 
                    ? '0 3px 10px rgba(59, 130, 246, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  fontSize: 15,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  border: isUser ? 'none' : '1px solid #e2e8f0'
                }}>
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <div style={{
                    fontSize: 11,
                    color: '#94a3b8',
                    marginTop: 4,
                    textAlign: isUser ? 'right' : 'left',
                    paddingLeft: isUser ? 0 : 4,
                    paddingRight: isUser ? 4 : 0
                  }}>
                    {formatMessageTime(msg.timestamp)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ 
        display: "flex", 
        padding: '16px 20px', 
        borderTop: "2px solid #e2e8f0", 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        gap: 12
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '12px 18px', 
            borderRadius: 24, 
            border: "2px solid #e2e8f0", 
            fontSize: 15, 
            outline: 'none', 
            background: '#fff', 
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            transition: 'border 0.2s, box-shadow 0.2s'
          }}
          placeholder="Nhập tin nhắn..."
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          onFocus={e => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
          }}
        />
        <button 
          onClick={sendMessage} 
          style={{ 
            padding: "12px 28px", 
            borderRadius: 24, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
            color: '#fff', 
            fontWeight: 700, 
            border: 'none', 
            fontSize: 15, 
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;