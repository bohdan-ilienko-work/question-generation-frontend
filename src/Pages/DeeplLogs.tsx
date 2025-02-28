import { useDispatch } from "react-redux";
import {
  setDeeplLogsLimit,
  setDeeplLogsPage,
  useGetDeeplLogsQuery,
  useSelectDeeplLogsFilters,
} from "../state";
import { useEffect, useRef } from "react";
import Loader from "../components/Loader";

const DeeplLogs = () => {
  const dispatch = useDispatch();
  const { limit, page, totalPages } = useSelectDeeplLogsFilters();
  const isFirstRender = useRef(true);

  const { data, error, isLoading, refetch } = useGetDeeplLogsQuery({
    limit,
    page,
  });

  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <p className="text-red-500">
        Error:{" "}
        {error && "data" in error
          ? (error.data as { message: string }).message
          : "An error occurred"}
      </p>
    );

  return (
    <div className="mx-auto space-y-6 flex justify-center flex-col items-center w-11/12">
      <div className="bg-white p-4 rounded-md shadow-md flex flex-wrap gap-4 items-center">
        {/* 🔹 фільтр початку логів */}
        <div>
          <label htmlFor="start-date" className="text-sm font-semibold">
            Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* 🔹 фільтр кінця логів */}
        <div>
          <label htmlFor="end-date" className="text-sm font-semibold">
            End Date:
          </label>
          <input
            type="date"
            id="end-date"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* 🔹 фільтр по мові соурс */}
        <div>
          <label htmlFor="language" className="text-sm font-semibold">
            Source Language:
          </label>
          <select id="language" className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="uk">Ukrainian</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="nl">Dutch</option>
            <option value="pl">Polish</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        {/* 🔹 фільтр по мові таргет */}
        <div>
          <label htmlFor="target-language" className="text-sm font-semibold">
            Target Language:
          </label>
          <select id="target-language" className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="uk">Ukrainian</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="nl">Dutch</option>
            <option value="pl">Polish</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>
      </div>

      {/* статы requestCount и totalCharacters */}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="bg-white p-4 rounded-md shadow-md">
          <span className="text-md font-semibold text-purple-500">
            Total Requests: {data?.responseObject.totalRequests}
          </span>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <span className="text-md font-semibold text-green-500">
            Total Characters: {data?.responseObject.totalCharacters}
          </span>
        </div>
      </div>

      {/* 🔹 Карточки логов */}
      <div className="grid md:grid-cols-3 gap-6">
        {data?.responseObject.logs.map((log) => (
          <div
            key={log._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              Log ID: {log._id}
            </h4>
            <p className="text-sm text-gray-600">
              <strong>Requested Text:</strong> {log.requestText}
            </p>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>
                <strong>Source:</strong> {log.sourceLanguage}
              </span>
              <span>
                <strong>Target:</strong> {log.targetLanguage}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>
                <strong>Characters Used:</strong> {log.charactersUsed}
              </span>
              <span>
                <strong>Created At:</strong>{" "}
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => dispatch(setDeeplLogsPage(page > 1 ? page - 1 : 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            dispatch(setDeeplLogsPage(page < totalPages ? page + 1 : 1))
          }
          disabled={page >= totalPages}
        >
          Next
        </button>

        <div className="px-4 py-2 bg-gray-300 rounded">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              dispatch(setDeeplLogsLimit(+e.target.value));
              dispatch(setDeeplLogsPage(1));
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeeplLogs;
