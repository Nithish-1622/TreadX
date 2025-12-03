import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  Package,
  Calendar,
  BarChart2,
  Bell,
  MessageCircle,
  LogOut,

  GitPullRequestCreateIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Edit Shop Data", icon: User, path: "/editshop" },
  { name: "Tyre Inventory Management", icon: Package, path: "/inventory" },
  { name: "Order sheduled & Management", icon: Calendar, path: "/orders" },
  { name: "billing-generator", icon: Bell, path: "/billing" },

  //{ name: "Notifications", icon: Bell, path: "/notifications" },
  {
    name: "Tyres Requested",
    icon: GitPullRequestCreateIcon,
    path: "/tyrerequested",
  },
]; 

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 sm:hidden text-gray-500"
      >
        <svg className="h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white shadow-lg border-r transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <img
              src="https://cdn5.vectorstock.com/i/1000x1000/64/39/tire-repair-shop-logo-design-vector-37146439.jpg"
              alt="RevoZen Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-orange-600 ml-2">
              TreadX
            </span>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-2">
            {menuItems.map(({ name, icon: Icon, path }, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(path);
                    closeSidebar();
                  }}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${
                    window.location.pathname === path
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`${
                      window.location.pathname === path
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                  {name}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg font-medium text-sm w-full text-left"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
