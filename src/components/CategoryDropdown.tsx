import { useState, useRef, useEffect } from "react";
import { Category } from "../types";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category) => void;
  handleTitleChange: (title: string) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  totalPages: number;
  page: number;
  limit: number;
  title?: string;
}
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  handleTitleChange,
  handlePageChange,
  handleLimitChange,
  totalPages,
  page,
  limit,
  title,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие дропдауна при клике вне него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка для открытия дропдауна */}
      <div
        className="p-2 border border-gray-400 rounded-md text-black bg-white focus:ring-2 focus:ring-blue-400 cursor-pointer flex justify-between items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{selectedCategory?.name || "Select category"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 9l-7.5 7.5L4.5 9"
          />
        </svg>
      </div>

      {/* Выпадающее окно */}
      {dropdownOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 p-3">
          {/* Поле для поиска */}
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            placeholder="Search category..."
            onChange={(e) => handleTitleChange(e.target.value)}
            value={title}
          />

          {/* Список категорий */}
          <ul className="max-h-40 overflow-y-auto">
            {categories?.map((category) => (
              <li
                key={category._id}
                className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                onClick={() => {
                  setSelectedCategory(category);
                  setDropdownOpen(false);
                }}
              >
                {category.name}
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          <div className="flex justify-between items-center mt-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              disabled={page <= 1}
              onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              onClick={() =>
                handlePageChange(page < totalPages ? page + 1 : totalPages)
              }
              disabled={page >= totalPages}
            >
              Next
            </button>

            <select
              className="p-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
