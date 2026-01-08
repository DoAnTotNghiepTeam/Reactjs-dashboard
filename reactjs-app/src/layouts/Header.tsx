import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu } from "@headlessui/react";
import { useAuthStore } from "../stores/useAuthorStore";
import NotificationDropdown from "../modules/notification/NotificationDropdown";
import apiClient from "../libs/api-client";
import "./style.css";

export default function CustomHeader() {
    const [scroll, setScroll] = useState(false);
    const [balance, setBalance] = useState<string>("0");

    const { loggedInUser } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchUserBalance = async () => {
            const isAdmin = loggedInUser?.roles?.includes("Administrators");
            if (loggedInUser?.id && !isAdmin) {
                try {
                    const response = await apiClient.get(`/users/${loggedInUser.id}`);
                    const userData = response.data || response;
                    setBalance(userData.balance || "0");
                } catch (error) {
                    console.error("Error fetching user balance:", error);
                }
            }
        };
        fetchUserBalance();
    }, [loggedInUser?.id, loggedInUser?.roles]);

    const formatBalance = (value: string) => {   // format chỗ này để có dấu , chỗ số dư 
        const num = parseFloat(value);
        return num.toLocaleString("en-US", { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        });
    };

    return (
        <header className={`custom-header ${scroll ? "sticky" : ""}`}>
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src="assets/imgs/page/dashboard/logo.svg" alt="JobBox" />
                </Link>
                <span className="admin-badge">Admin area</span>
            </div>

            <div className="header-right">
                {/* 🔔 Notification Dropdown */}
                <div style={{ marginRight: 16 }}>
                    <NotificationDropdown />
                </div>
                <div className="user-profile">
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-2 cursor-pointer">
                            <img
                                src={`https://i.pravatar.cc/150?u=${loggedInUser?.id || Math.random()}`}
                                alt="profile"
                                className="avatar w-10 h-10 rounded-full"
                                style={{ boxShadow: "0 2px 8px #eee" }}
                            />
                            <div className="info text-left">
                                <strong className="block">{loggedInUser?.username || "Steven Jobs"}</strong>
                                <span className="role text-sm text-gray-500">
                                    {loggedInUser?.roles?.includes("Administrators") ? "Super Admin" : "Super Employer"} ▾
                                </span>
                                {!loggedInUser?.roles?.includes("Administrators") && (
                                    <div style={{ 
                                        color: "#059669", 
                                        fontWeight: 600, 
                                        fontSize: "13px",
                                        marginTop: "2px"
                                    }}>
                                        {formatBalance(balance)} VND
                                    </div>
                                )}
                            </div>
                        </Menu.Button>

                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/profile"
                                        className={`dropdown-item block px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                                    >
                                        Profile
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/login"
                                        className={`dropdown-item block px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                                    >
                                        Logout
                                    </Link>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
        </header>
    );
}