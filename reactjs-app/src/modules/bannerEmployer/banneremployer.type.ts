export interface BannerEmployer {
	id: number;
	companyName: string;
	companyEmail: string;
	companyPhone: string;
	companyWebsite?: string;
	bannerTitle: string;
	bannerImage: string;
	bannerType?: string;
	startDate: string;
	endDate: string;
	amount?: number;
	price?: number;
	status: "ACTIVE" | "PENDING" | "REJECTED";
	description?: string;
	userId: number;
	// userName?: string;
	createdAt?: string;
	updatedAt?: string;
}
