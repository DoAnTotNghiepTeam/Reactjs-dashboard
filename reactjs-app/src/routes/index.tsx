
import type { ReactNode } from "react";
import { routesDashboard } from "../modules/dashboard/dashboard.route";
import { routesAuth } from "../modules/auth/auth.route";
// import { routesProduct } from '../modules/product/product.route';
// import { routesAdministrator } from '../modules/administrator/administrator.route';

// Các route chung
import { routesEmployer } from "../modules/employer/empoyer.route";
import { routesUser } from "../modules/user/user.route";
import { routesRecuiter } from "../modules/recuiters/recuiter.route";
import { routesCandidate } from "../modules/candidates/candidate.route";
import { routesChat } from "../modules/Chat/chat.route";

// JobPosting có sự khác nhau giữa các nhánh => ưu tiên import từ đường dẫn mới,
// nếu module cũ vẫn còn thì có thể đổi alias để tránh lỗi.
import { routesjobPosting } from "../modules/employeeJobApplicant/jobposting.route";
// import { routesjobPosting } from "../modules/employeeJobApplicant/jobposting.route";

// Từ HEAD
import { routesDeposit } from "../modules/deposit/deposit.route";
import { routesProfile } from "../modules/profile/profile.route";
import { routesSystemLog } from "../modules/systemlog/systemlog.route";
import { routesBannerEmployer } from "../modules/bannerEmployer/banneremployer.route";
import { routesBannerAdmin } from "../modules/bannerAdmin/banneradmin.route";

// Từ origin/thanhphat
import { routesBlog } from "../modules/blog/blog.router";
import { routesCategory } from "../modules/category/category.route";
import { routesOurTeam } from "../modules/ourTeam/ourTeam.router";
import { aboutUsRoute } from "../modules/aboutUs/aboutUs.route";

export type RouteItem = {
  path?: string;
  label: React.ReactNode;
  key: string;
  icon?: ReactNode;
  element?: React.ReactNode | null;
  children?: RouteItem[];
  isShowMenu: boolean; // xác định có hiển thị menu hay không
  isPrivate: boolean;  // xác định có phải là route riêng tư hay không
  roles?: string[];    // xác định các vai trò được phép truy cập route
};

export const routes: RouteItem[] = [
  ...routesDashboard,   // đăng ký route dashboard
  ...routesAuth,
  // ...routesProduct,
  // ...routesAdministrator,
  ...routesEmployer,
  ...routesUser,
  ...routesRecuiter,
  ...routesCandidate,
  ...routesChat,
  ...routesjobPosting,

  // từ HEAD
  ...routesDeposit,
  ...routesProfile,
  ...routesSystemLog,
  ...routesBannerEmployer,
  ...routesBannerAdmin,

  // từ origin/thanhphat
  ...routesBlog,
  ...routesCategory,
  ...routesOurTeam,
  ...aboutUsRoute,
];
