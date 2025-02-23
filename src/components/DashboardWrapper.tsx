import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLogoutMutation } from "../state/api/authApi";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

export default function DashboardWrapper() {
  const [logout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/generate-question"
            className={({ isActive }) =>
              `p-2 rounded-md text-gray-700 font-medium transition ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Generate Questions
          </NavLink>
          <NavLink
            to="/generated-questions"
            className={({ isActive }) =>
              `p-2 rounded-md text-gray-700 font-medium transition ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Generated Questions
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2 rounded-md text-gray-700 font-medium transition ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Settings
          </NavLink>
          <button
            onClick={handleLogoutClick}
            className="p-2 rounded-md text-white bg-red-500 font-medium transition hover:bg-red-600 flex items-center"
          >
            Logout
            <svg
              fill="#FFFFFF"
              className="w-4 h-4 ml-2"
              viewBox="0 0 471.2 471.2"
            >
              <path d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5 s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5 S235.019,444.2,227.619,444.2z" />
              <path d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5 s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8 C455.319,239.9,455.319,231.3,450.019,226.1z" />
            </svg>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
