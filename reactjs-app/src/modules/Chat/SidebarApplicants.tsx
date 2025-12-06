
import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "./libraries/firebase/initializaApp";
import { fetchProfile } from "../profile/profile.service";

import type { Timestamp } from "firebase/firestore";
interface Applicant {
  id: string;
  applicantId: string;
  applicantName?: string;
  lastTimestamp?: Timestamp;
  unreadForEmployer?: boolean;
}

interface SidebarApplicantsProps {
  employerId: string;
  // now pass both id and optional name so the ChatPage/ChatBox can show the name immediately
  onSelectApplicant: (applicant: { applicantId: string; applicantName?: string }) => void;
}

const SidebarApplicants: React.FC<SidebarApplicantsProps> = ({ employerId, onSelectApplicant }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  // cache fetched applicant names to avoid repeated backend calls
  const nameCache = useRef<Record<string, string>>({});
  const fetching = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Firestore may store employerId as number or string. Query both possible representations using 'in' when helpful.
    // Luôn query cả số và chuỗi để đảm bảo lấy được dữ liệu bất kể kiểu lưu trong Firestore
    const asString = String(employerId);
    const asNumber = !isNaN(Number(employerId)) ? Number(employerId) : null;
    let q;
    if (asNumber !== null && asString !== String(asNumber)) {
      q = query(collection(db, "chats"), where("employerId", "in", [asNumber, asString]));
    } else if (asNumber !== null) {
      q = query(collection(db, "chats"), where("employerId", "in", [asNumber, asString]));
    } else {
      q = query(collection(db, "chats"), where("employerId", "==", asString));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, data: d.data() }));
      console.log('[DEBUG SidebarApplicants] snapshot docs:', JSON.stringify(docs, null, 2));
      const list: Applicant[] = snapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        applicantId: String(doc.data().applicantId),
        applicantName: doc.data().applicantName,
        lastTimestamp: doc.data().lastTimestamp,
        unreadForEmployer: !!doc.data().unreadForEmployer,
      }));
      // Sắp xếp: tin nhắn mới chưa đọc lên đầu, sau đó theo lastTimestamp
      list.sort((a, b) => {
        if (a.unreadForEmployer && !b.unreadForEmployer) return -1;
        if (!a.unreadForEmployer && b.unreadForEmployer) return 1;
        if (!a.lastTimestamp && !b.lastTimestamp) return 0;
        if (!a.lastTimestamp) return 1;
        if (!b.lastTimestamp) return -1;
        return b.lastTimestamp.toMillis() - a.lastTimestamp.toMillis();
      });
      setApplicants(list);
      setLoading(false);

      // for any entry missing applicantName, try to fetch from backend profile
      const missing = list.filter(a => !a.applicantName).map(a => a.applicantId);
      if (missing.length > 0) {
        // only fetch for ids not in cache
        const toFetch = missing.filter(id => !nameCache.current[id]);
        if (toFetch.length > 0) {
          Promise.all(toFetch.map(id => {
            // try numeric id when possible
            const param = /^\d+$/.test(id) ? Number(id) : id;
            return fetchProfile(param).catch((err) => { console.error('[SidebarApplicants] fetchProfile failed for', id, err); return null; });
          })).then(results => {
            const updates: Record<string, string> = {};
            results.forEach((res, idx) => {
              const id = toFetch[idx];
              console.debug('[SidebarApplicants] fetchProfile result for', id, res);
              if (res && (res.data || res.fullName || res.fullname || res.name || res.username || res.email)) {
                // support different response shapes (axios or fetch)
                const payload = res.data ? res.data : res;
                const name = payload.fullName || payload.fullname || payload.name || payload.username || payload.email;
                nameCache.current[id] = name;
                updates[id] = name;
                // persist the discovered applicantName back to Firestore summary doc
                try {
                  const chatId = `${employerId}_${id}`; // use original employerId prop to construct chatId
                  console.debug('[SidebarApplicants] persisting applicantName', { chatId, name });
                  setDoc(doc(db, 'chats', chatId), { applicantName: name }, { merge: true }).catch(err => console.error('setDoc failed for chat summary', chatId, err));
                } catch (err) {
                  console.error('setDoc exception', id, err);
                }
              }
            });
            if (Object.keys(updates).length > 0) {
              setApplicants(prev => prev.map(p => ({ ...p, applicantName: p.applicantName ?? updates[p.applicantId] ?? p.applicantName })));
            }
          }).catch((e) => { console.error('Error resolving applicant names', e); });
        }
      }
    });
    return () => unsubscribe();
  }, [employerId]);

  // ensure individual missing names are fetched (in case batch missed or new items arrive)
  useEffect(() => {
    if (applicants.length === 0) return;
    const parsed = Number(employerId);
    const valueToQuery = !isNaN(parsed) ? parsed : employerId;
    applicants.forEach(app => {
      const id = app.applicantId;
      if (app.applicantName) return; // already have name
      if (nameCache.current[id]) {
        // fill from cache
        setApplicants(prev => prev.map(p => p.applicantId === id ? { ...p, applicantName: nameCache.current[id] } : p));
        return;
      }
      if (fetching.current[id]) return; // already fetching
      fetching.current[id] = true;
      fetchProfile(id).then(res => {
        if (res && (res.fullName || res.fullname || res.name || res.username || res.email)) {
          const name = res.fullName || res.fullname || res.name || res.username || res.email;
          nameCache.current[id] = name;
          setApplicants(prev => prev.map(p => p.applicantId === id ? { ...p, applicantName: name } : p));
          // persist to Firestore chat summary so future loads have it
          const chatId = `${valueToQuery}_${id}`;
          setDoc(doc(db, 'chats', chatId), { applicantName: name }, { merge: true }).catch(err => console.error('setDoc failed for chat summary', chatId, err));
        }
      }).catch(err => {
        console.error('fetchProfile failed for', id, err);
      }).finally(() => {
        fetching.current[id] = false;
      });
    });
  }, [applicants, employerId]);

  if (loading) return <div style={{padding: 16, textAlign: 'center'}}>Đang tải...</div>;
  if (applicants.length === 0) return <div style={{padding: 16, textAlign: 'center'}}>Chưa có tin nhắn nào nhắn tới bạn</div>;

  // Avatar mặc định (có thể thay bằng ảnh thật nếu có)
  const defaultAvatar = (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', background: '#e0e7ef',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#4a5568', fontSize: 18, marginRight: 12
    }}>
      <span role="img" aria-label="avatar">👤</span>
    </div>
  );

  return (
    <div style={{background: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px #e2e8f0', padding: 8, minWidth: 260}}>
      {applicants.map(applicant => {
        const isActive = activeId === applicant.applicantId;
        return (
          <div
            key={applicant.id}
            onClick={async () => {
              setActiveId(applicant.applicantId);
              onSelectApplicant({ applicantId: applicant.applicantId, applicantName: applicant.applicantName });
              // Đánh dấu đã đọc khi click vào
              try {
                await setDoc(doc(db, 'chats', applicant.id), { unreadForEmployer: false }, { merge: true });
              } catch (e) { console.error('Mark as read failed', e); }
            }}
            style={{
              display: 'flex', alignItems: 'center', cursor: 'pointer',
              padding: '10px 12px', marginBottom: 4, borderRadius: 6,
              background: isActive ? '#e0e7ef' : applicant.unreadForEmployer ? '#fef9c3' : 'transparent',
              border: isActive ? '1.5px solid #3b82f6' : applicant.unreadForEmployer ? '1.5px solid #facc15' : '1px solid #e5e7eb',
              transition: 'background 0.2s, border 0.2s',
              boxShadow: isActive ? '0 2px 8px #c7d2fe' : applicant.unreadForEmployer ? '0 2px 8px #fde68a' : undefined
            }}
            onMouseEnter={e => (e.currentTarget.style.background = applicant.unreadForEmployer ? '#fef08a' : '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.background = isActive ? '#e0e7ef' : applicant.unreadForEmployer ? '#fef9c3' : 'transparent')}
          >
            {defaultAvatar}
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 600, color: '#1e293b', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {applicant.applicantName || 'Chưa rõ tên'}
                {applicant.unreadForEmployer && <span style={{marginLeft: 8, color: '#f59e42', fontSize: 13, fontWeight: 700}}>• Mới</span>}
              </div>
              <div style={{fontSize: 13, color: '#64748b', marginTop: 2}}>
                ID: {applicant.applicantId}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarApplicants;