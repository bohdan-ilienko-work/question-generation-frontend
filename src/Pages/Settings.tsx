import { useSyncCategoriesMutation } from "../state";
import { useState } from "react";

const Settings = () => {
  const [syncCategories, { isLoading }] = useSyncCategoriesMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setErrorMessage(null); // Сбрасываем ошибку перед началом
      await syncCategories().unwrap();
    } catch {
      setErrorMessage("Failed to sync categories. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Кнопка синхронизации с индикатором загрузки */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 flex items-center"
        onClick={handleSync}
        disabled={isLoading}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            ></path>
          </svg>
        )}
        {isLoading ? "Syncing..." : "Sync categories"}
      </button>

      {/* Вывод ошибки при неудачном синке */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default Settings;
