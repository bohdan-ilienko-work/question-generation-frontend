import { useState, useRef, useEffect } from "react";
import { Category } from "../types";
import { useClearCategoryCacheMutation } from "../state";

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
  const [clearCache, { isLoading: isClearingCache }] =
    useClearCategoryCacheMutation();

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

  const handleClearCache = async (categoryId: number) => {
    try {
      await clearCache({ categoryId: Number(categoryId) }).unwrap();
    } catch (error) {
      console.error("Failed to clear cache:", error);
      alert("Failed to clear cache");
    }
  };

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
                className="p-2 hover:bg-gray-200 cursor-pointer rounded flex justify-between items-center"
                onClick={() => {
                  setSelectedCategory(category);
                  setDropdownOpen(false);
                }}
              >
                {category.name}
                <button
                  className="ml-2 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearCache(category._id);
                  }}
                >
                  {isClearingCache ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v1m0 14v1m8-10h-1m-14 0H4m16.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                      />
                    </svg>
                  ) : (
                    <span>Clear Cache</span>
                  )}
                </button>
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
