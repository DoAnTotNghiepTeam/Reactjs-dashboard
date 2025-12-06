export interface BannerAdminType {
  id: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite: string;
  bannerTitle: string;
  bannerImage: string;
  bannerLink: string;
  position: string;
  startDate: string;
  endDate: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  bannerType: string;
}

export interface GetAllBannerAdminResponse {
  data: BannerAdminType[];
}
