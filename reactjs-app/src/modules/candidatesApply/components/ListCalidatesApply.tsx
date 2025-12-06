import React, { useEffect, useState } from "react";
import { Avatar, Pagination, Tag, Card, Select, DatePicker, Space, Button, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useAuthStore } from "../../../stores/useAuthorStore";

interface CandidateApply {
	jobPostingId: number;
	jobTitle: string;
	candidateId: number;
	fullName: string;
	email: string;
	phoneNumber?: string | null;
	avatar?: string | null;
	coverLetter?: string | null;
	resumeLink?: string | null;
	applicationStatus: string;
	appliedAt: string;
}

interface ApiResponse {
	content: CandidateApply[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}


const ListCalidatesApply: React.FC = () => {
	const [data, setData] = useState<CandidateApply[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [pageSize, setPageSize] = useState(5);
    const { loggedInUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
			const [period, setPeriod] = useState<'week' | 'month' | 'custom'>('week');
			const [customRange, setCustomRange] = useState<[any, any] | null>(null);
			const [status, setStatus] = useState<string>('ALL');
			const [jobPostingId, setJobPostingId] = useState<string>('ALL');
			const [jobOptions, setJobOptions] = useState<{ value: string, label: string }[]>([]);

			const fetchData = async (pageNum: number = 1) => {
				setLoading(true);
				let url = `http://localhost:8080/api/applicant/${loggedInUser?.id}/filter?period=${period}&page=${pageNum-1}&size=${pageSize}`;
					if (period === 'custom' && customRange) {
						const start = dayjs(customRange[0]).format('YYYY-MM-DDT00:00:00');
						const end = dayjs(customRange[1]).format('YYYY-MM-DDT23:59:59');
						url += `&startDate=${start}&endDate=${end}`;
					}
				if (status && status !== 'ALL') {
					url += `&status=${status}`;
				}
				if (jobPostingId && jobPostingId !== 'ALL') {
					url += `&jobPostingId=${jobPostingId}`;
				}
				try {
					const res = await fetch(url);
					const json: ApiResponse = await res.json();
					setData(json.content);
					setTotal(json.totalElements);
					setPageSize(json.size);
					// Lấy danh sách jobPostingId từ dữ liệu trả về
					const jobs = Array.from(new Set(json.content.map(i => ({ value: String(i.jobPostingId), label: i.jobTitle }))));
					setJobOptions([{ value: 'ALL', label: 'Tất cả bài đăng' }, ...jobs]);
				} finally {
					setLoading(false);
				}
			};

				useEffect(() => {
					// Nếu lọc theo custom thì chỉ fetch khi nhấn nút Lọc và đã chọn đủ ngày
					if (period === 'custom') return;
					fetchData(page);
				}, [page, period, status, jobPostingId]);

		return (
			<div style={{ padding: 32, background: "#f9fafb", minHeight: "100vh" }}>
						<h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Danh sách ứng viên đã ứng tuyển</h2>
						<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
							<Space>
								<Select value={period} onChange={v => { setPeriod(v); setPage(1); }} style={{ width: 160 }}>
									<Select.Option value="week">Tuần này</Select.Option>
									<Select.Option value="month">Tháng này</Select.Option>
									<Select.Option value="custom">Khoảng thời gian</Select.Option>
								</Select>
								{period === 'custom' ? (
									<DatePicker.RangePicker
										value={customRange}
										onChange={dates => setCustomRange(dates)}
										format="DD/MM/YYYY"
										style={{ minWidth: 220 }}
									/>
								) : null}
								<Select value={jobPostingId} onChange={v => { setJobPostingId(v); setPage(1); }} style={{ width: 180 }}>
									{jobOptions.map(opt => (
										<Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
									))}
								</Select>
								<Select value={status} onChange={v => { setStatus(v); setPage(1); }} style={{ width: 140 }}>
									<Select.Option value="ALL">Tất cả trạng thái</Select.Option>
									<Select.Option value="PENDING">PENDING</Select.Option>
									<Select.Option value="CV_REVIEW">CV_REVIEW</Select.Option>
									<Select.Option value="INTERVIEW">INTERVIEW</Select.Option>
									<Select.Option value="OFFER">OFFER</Select.Option>
									<Select.Option value="HIRED">HIRED</Select.Option>
									<Select.Option value="REJECTED">REJECTED</Select.Option>
								</Select>
								<Button
									onClick={() => {
										if (period === 'custom' && customRange && customRange[0] && customRange[1]) {
											setPage(1);
											fetchData(1);
										} else if (period !== 'custom') {
											setPage(1);
											fetchData(1);
										}
									}}
									type="primary"
									disabled={period === 'custom' && (!customRange || !customRange[0] || !customRange[1])}
								>Lọc</Button>
							</Space>
						</div>
				{loading ? (
					<div style={{ textAlign: "center", padding: "4rem 0" }}>
						<Spin size="large" />
					</div>
				) : data.length === 0 ? (
					<div style={{ textAlign: "center", padding: "4rem 0" }}>
						<Empty description="Không có dữ liệu ứng viên" />
					</div>
				) : (
					<>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
							{data.map((item) => (
								<Card key={item.candidateId + item.jobPostingId + item.appliedAt} style={{ borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
									<div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
										<Avatar src={item.avatar || undefined} size={56} style={{ background: "#e5e7eb" }}>
											{item.fullName?.charAt(0).toUpperCase()}
										</Avatar>
										<div>
											<div style={{ fontWeight: 600, fontSize: 18 }}>{item.fullName}</div>
											<div style={{ color: "#6b7280", fontSize: 14 }}>{item.email}</div>
										</div>
									</div>
									<div style={{ marginBottom: 8 }}>
										<span style={{ fontWeight: 500 }}>Vị trí:</span> {item.jobTitle}
									</div>
									<div style={{ marginBottom: 8 }}>
										<span style={{ fontWeight: 500 }}>Ngày ứng tuyển:</span> {new Date(item.appliedAt).toLocaleString()}
									</div>
									<div style={{ marginBottom: 8 }}>
										<span style={{ fontWeight: 500 }}>Trạng thái:</span> {item.applicationStatus === "PENDING" ? <Tag color="gold">PENDING</Tag> : <Tag color="green">{item.applicationStatus}</Tag>}
									</div>
									{item.coverLetter && (
										<div style={{ marginBottom: 8 }}>
											<span style={{ fontWeight: 500 }}>Thư ứng tuyển:</span> <span style={{ color: "#374151" }}>{item.coverLetter}</span>
										</div>
									)}
									{item.resumeLink && (
										<div style={{ marginBottom: 8 }}>
											<span style={{ fontWeight: 500 }}>CV:</span> <a href={item.resumeLink} target="_blank" rel="noopener noreferrer">Xem CV</a>
										</div>
									)}
								</Card>
							))}
						</div>
						<div style={{ textAlign: "center", marginTop: 32 }}>
							<Pagination
								current={page}
								pageSize={pageSize}
								total={total}
								onChange={setPage}
								showSizeChanger={false}
							/>
						</div>
					</>
				)}
			</div>
		);
};

export default ListCalidatesApply;
