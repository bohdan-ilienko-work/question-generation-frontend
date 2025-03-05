import { useDispatch } from "react-redux";
import {
  setDeeplLogsLimit,
  setDeeplLogsPage,
  setDeeplLogsSourceLanguage,
  setDeeplLogsTargetLanguage,
  setDeeplLogsStartDate,
  setDeeplLogsEndDate,
  setDeeplLogsMinCharacters,
  setDeeplLogsMaxCharacters,
  useGetDeeplLogsQuery,
  useSelectDeeplLogsFilters,
} from "../state";
import { useEffect, useRef } from "react";
import Loader from "../components/Loader";

const DeeplLogs = () => {
  const dispatch = useDispatch();
  const {
    limit,
    page,
    totalPages,
    sourceLanguage,
    targetLanguage,
    endDate,
    startDate,
    minCharacters,
    maxCharacters,
  } = useSelectDeeplLogsFilters();
  const isFirstRender = useRef(true);

  const { data, error, isLoading, refetch } = useGetDeeplLogsQuery({
    limit,
    page,
    sourceLanguage,
    targetLanguage,
    startDate,
    endDate,
    minCharacters,
    maxCharacters,
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
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-md shadow-md flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="text-sm font-semibold">
            Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            className="p-2 border rounded-md"
            value={startDate}
            onChange={(e) => dispatch(setDeeplLogsStartDate(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="end-date" className="text-sm font-semibold">
            End Date:
          </label>
          <input
            type="date"
            id="end-date"
            className="p-2 border rounded-md"
            value={endDate}
            onChange={(e) => dispatch(setDeeplLogsEndDate(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="language" className="text-sm font-semibold">
            Source Language:
          </label>
          <select
            id="language"
            className="p-2 border rounded-md"
            value={sourceLanguage}
            onChange={(e) =>
              dispatch(setDeeplLogsSourceLanguage(e.target.value))
            }
          >
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

        <div className="flex flex-col">
          <label htmlFor="target-language" className="text-sm font-semibold">
            Target Language:
          </label>
          <select
            id="target-language"
            className="p-2 border rounded-md"
            value={targetLanguage}
            onChange={(e) =>
              dispatch(setDeeplLogsTargetLanguage(e.target.value))
            }
          >
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

        <div className="flex flex-col">
          <label htmlFor="min-characters" className="text-sm font-semibold">
            Min Characters:
          </label>
          <input
            type="number"
            id="min-characters"
            className="p-2 border rounded-md"
            value={minCharacters}
            onChange={(e) =>
              dispatch(setDeeplLogsMinCharacters(+e.target.value))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="max-characters" className="text-sm font-semibold">
            Max Characters:
          </label>
          <input
            type="number"
            id="max-characters"
            className="p-2 border rounded-md"
            value={maxCharacters}
            onChange={(e) =>
              dispatch(setDeeplLogsMaxCharacters(+e.target.value))
            }
          />
        </div>
      </div>

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

      {data!.responseObject!.logs!.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Log ID</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Requested Text
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Translated text
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Source</th>
                  <th className="border border-gray-300 px-4 py-2">Target</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Characters Used
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.responseObject.logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {log._id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {log.requestText}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {log.translatedText || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {log.sourceLanguage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {log.targetLanguage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {log.charactersUsed}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() =>
                dispatch(setDeeplLogsPage(page > 1 ? page - 1 : 1))
              }
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
        </>
      ) : (
        // <p className="text-red-500">No logs found</p>
        <div className="bg-white p-4 rounded-md shadow-md">
          <span className="text-md font-semibold text-red-500">
            No logs found for the selected filters. You can try changing the
            filters or check back later.
          </span>
        </div>
      )}
    </div>
  );
};

export default DeeplLogs;
