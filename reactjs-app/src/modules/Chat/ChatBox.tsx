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

  // if parent provides an initial applicant name (from sidebar), use it immediately
  // we'll prefer the prop over the summary snapshot when rendering

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
  // Avatar cho 2 phía
  const avatar = (isUser: boolean) => (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', background: isUser ? '#bae6fd' : '#e0e7ef',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: isUser ? '#0284c7' : '#64748b', fontSize: 18,
      margin: isUser ? '0 0 0 10px' : '0 10px 0 0', flexShrink: 0
    }}>
      <span role="img" aria-label="avatar">{isUser ? '🧑‍💼' : '👤'}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 16, borderBottom: "1.5px solid #e0e7ef", background: '#f1f5f9', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <strong>Ứng viên: </strong>
        {applicantName || maybeApplicantId || "(Không rõ)"}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: '#f8fafc' }}>
        {messages.length === 0 && (
          <div style={{textAlign: 'center', color: '#94a3b8', marginTop: 48, fontSize: 18}}>Chưa có tin nhắn nào</div>
        )}
        {messages.map(msg => {
          const isUser = msg.senderId === currentUserId;
          return (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', margin: '12px 0',
            }}>
              {avatar(isUser)}
              <div style={{ maxWidth: '70%', minWidth: 60 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, textAlign: isUser ? 'right' : 'left', fontWeight: 500 }}>
                  {isUser ? 'Bạn' : (applicantName || maybeApplicantId || msg.senderId)}
                </div>
                <div style={{
                  background: isUser ? 'linear-gradient(120deg, #bae6fd 0%, #e0f2fe 100%)' : '#fff',
                  color: '#0f172a',
                  padding: '10px 16px',
                  borderRadius: 16,
                  borderBottomRightRadius: isUser ? 4 : 16,
                  borderBottomLeftRadius: isUser ? 16 : 4,
                  boxShadow: '0 2px 8px #e0e7ef',
                  fontSize: 15,
                  wordBreak: 'break-word',
                  textAlign: 'left',
                  marginLeft: isUser ? 0 : 2,
                  marginRight: isUser ? 2 : 0
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", padding: 16, borderTop: "1.5px solid #e0e7ef", background: '#f1f5f9', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 12, borderRadius: 24, border: "1.5px solid #cbd5e1", fontSize: 15, outline: 'none', background: '#fff', boxShadow: '0 1px 4px #e0e7ef' }}
          placeholder="Nhập tin nhắn..."
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 12, padding: "10px 24px", borderRadius: 24, background: '#3b82f6', color: '#fff', fontWeight: 600, border: 'none', fontSize: 15, boxShadow: '0 2px 8px #c7d2fe', cursor: 'pointer', transition: 'background 0.2s' }}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;