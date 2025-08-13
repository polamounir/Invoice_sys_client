import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}

      <Navbar />

      {/* Main content */}
      <div className=" overflow-auto pt-10 md:pt-6 p-6 flex-1" dir="rtl">
        <Outlet />{" "}
    
      </div>
    </div>
  );
}
