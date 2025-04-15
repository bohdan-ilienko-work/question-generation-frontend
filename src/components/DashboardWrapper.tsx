import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLogoutMutation } from "../state/api/authApi";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

// 🔹 Компонент для ссылок в сайдбаре с анимированным подчёркиванием
const SidebarLink = ({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center justify-between w-full p-2 font-medium transition-colors ${
        isActive
          ? "text-blue-500 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-500 after:scale-x-100 after:transition-transform after:duration-300"
          : "text-gray-700 hover:text-blue-500 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-500 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
      }`
    }
  >
    <span>{label}</span>
    <img src={icon} alt={`${label} icon`} className="w-4 h-4" />
  </NavLink>
);

export default function DashboardWrapper() {
  const [logout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => setIsModalOpen(true);
  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
  };
  const cancelLogout = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          <SidebarLink
            to="/parse-questions"
            label="Parse Questions"
            icon="/read-era-svgrepo-com.svg"
          />
          <SidebarLink
            to="/generate-question"
            label="Generate Questions"
            icon="/openai-svgrepo-com.svg"
          />
          <SidebarLink
            to="/generated-questions"
            label="Generated Questions"
            icon="/list-ul-alt-svgrepo-com.svg"
          />
          <SidebarLink
            to="/questions-history"
            label="Questions History"
            icon="/list-ul-alt-svgrepo-com.svg"
          />
          <SidebarLink
            to="/deepl-logs"
            label="DeepL Logs"
            icon="/deepl-svgrepo-com.svg"
          />
          <SidebarLink
            to="/translated-questions"
            label="Translated Questions"
            icon="/language-translation-svgrepo-com.svg"
          />
          <a href="http://gen.battleofgeniuses.com/editor/" target="_blank" className="relative flex items-center justify-between w-full p-2 font-medium transition-colors text-gray-700 hover:text-blue-500 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-500 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">
            Go to Editor
          </a>
          <SidebarLink
            to="/categories-crud"
            label="Categories Editor"
            icon="/category-svgrepo-com.svg"
          />
          <SidebarLink
            to="/settings"
            label="Settings"
            icon="/settings-svgrepo-com.svg"
          />

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            style={{ color: "white" }}
            className="p-2 rounded-md bg-red-500 font-medium transition hover:bg-red-600 flex items-center"
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
