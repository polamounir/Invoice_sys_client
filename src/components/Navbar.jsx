import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Menu,
  X,
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { logout } from "../app/slices/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // go to login page
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    // {
    //   name: "Customers",
    //   icon: <Users size={18} />,
    //   path: "/dashboard/customers",
    // },
    {
      name: "Invoices",
      icon: <FileText size={18} />,
      path: "/dashboard/invoices",
    },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden text-black p-3 flex justify-end items-center fixed top-0 w-full">
       
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white shadow-lg z-50 transform 
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        {/* Logo */}
        <div className="p-4 font-bold text-xl border-b border-gray-800">
          Invoice<span className="text-indigo-400">Pro</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-gray-800 text-indigo-400" : "hover:bg-gray-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full p-2 rounded hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
