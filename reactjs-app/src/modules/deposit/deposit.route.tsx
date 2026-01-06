import { MoneyCollectOutlined } from "@ant-design/icons";
import type { RouteItem } from "../../routes";
import DepositPage from "./DepositPage";
import SuccessDepositPage from "./SuccessDepositPage";
import PayPalConfirmPage from "./PayPalConfirmPage";

export const routesDeposit: RouteItem[] = [
  {
    path: "/deposit",
    label: <span style={{ fontSize: 18, fontWeight: "bold" }}>deposit money</span>,
    key: "deposit",
    icon: <MoneyCollectOutlined style={{ fontSize: 22, color: "#66789c" }} />,
    element: <DepositPage />,
    isShowMenu: true,
    isPrivate: true,
    roles: ["Employers"],
  },
  {
    path: "/deposit/success",
    key: "deposit-success",
    label: "",
    element: <SuccessDepositPage />,
    isShowMenu: false,
    isPrivate: true,
    roles: ["Employers"],
  },
  {
    path: "/deposit/paypal/confirm",
    key: "deposit-paypal-confirm",
    label: "",
    element: <PayPalConfirmPage />,
    isShowMenu: false,
    isPrivate: true,
    roles: ["Employers"],
  },
];
