import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu } from "@headlessui/react";
import { useAuthStore } from "../stores/useAuthorStore";
import { Bell } from "lucide-react";
import "./style.css";

export default function CustomHeader() {
    const [scroll, setScroll] = useState(false);

    const { loggedInUser } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`custom-header ${scroll ? "sticky" : ""}`}>
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src="assets/imgs/page/dashboard/logo.svg" alt="JobBox" />
                </Link>
                <span className="admin-badge">Admin area</span>
            </div>

            <div className="header-right">
                {/* 🔔 Icon chuông */}
                <button className="relative " style={{ marginRight: 16 }}>
                    <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
                    {/* Badge số thông báo */}
                    {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        300
                    </span> */}
                </button>
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
                                <span className="role text-sm text-gray-500">Super Admin ▾</span>
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