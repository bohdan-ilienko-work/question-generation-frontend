import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setHistoryQuestionsDifficulty,
  setHistoryQuestionsLimit,
  setHistoryQuestionsPage,
  setHistoryQuestionsStatus,
  setHistoryQuestionsTitle,
  setHistoryQuestionsType,
  useGetQuestionsHistoryQuery,
  useSelectHistoryQuestionsFilters,
} from "../state";
import Loader from "../components/Loader";
import { Question, QuestionStatus, QuestionType } from "../types";
import TranslatedQuestionItem from "../components/TranslatedQuestionItem";

const TranslatedQuestions = () => {
  const dispatch = useDispatch();

  const { limit, page, difficulty, type, title, status, totalPages } =
    useSelectHistoryQuestionsFilters();

  const { data, isLoading, error, refetch } = useGetQuestionsHistoryQuery({
    limit,
    page,
    difficulty,
    type,
    title,
    status,
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page, difficulty, type, title, refetch]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <p className="text-red-500">
        Error:{" "}
        {error && "data" in error
          ? (error.data as { message: string }).message
          : "An error occurred"}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-[calc(100vh-3rem)] space-y-4">
      <div className="bg-white p-4 rounded-md shadow-md flex flex-wrap gap-4 items-center">
        {/* Фильтр по сложности */}
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) =>
              dispatch(setHistoryQuestionsDifficulty(e.target.value))
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="1">1 (Easy)</option>
            <option value="2">2</option>
            <option value="3">3 (Medium)</option>
            <option value="4">4</option>
            <option value="5">5 (Hard)</option>
          </select>
        </div>
        {/* Фильтр типа вопроса */}
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) =>
              dispatch(setHistoryQuestionsType(e.target.value as QuestionType))
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="map">Map</option>
            <option value="choice">One Choice</option>
          </select>
        </div>

        {/* Фильтр по названию вопроса */}
        <div>
          <label className="block text-sm font-medium">Question Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => dispatch(setHistoryQuestionsTitle(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="Enter question title..."
          />
        </div>

        {/* Фильтр по статусу */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) =>
              dispatch(
                setHistoryQuestionsStatus(e.target.value as QuestionStatus)
              )
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="proof_reading">Proof Reading</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Контейнер для списка вопросов */}
      <div className="flex-grow overflow-auto px-4">
        {data && data.responseObject.questions.length > 0 ? (
          data.responseObject.questions.map(
            (question: Question, index: number) => (
              <TranslatedQuestionItem
                key={question._id}
                question={question}
                index={limit * (page - 1) + index}
              />
            )
          )
        ) : (
          <p className="text-center text-gray-500">No questions available.</p>
        )}
      </div>

      {/* Фиксированная пагинация внизу */}
      <div className="flex justify-center items-center py-4 bg-white shadow-md border-t w-full">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          onClick={() =>
            dispatch(setHistoryQuestionsPage(page > 1 ? page - 1 : 1))
          }
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-6 py-2 text-lg font-semibold text-gray-700">
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          onClick={() =>
            dispatch(setHistoryQuestionsPage(page < totalPages ? page + 1 : 1))
          }
          disabled={page >= totalPages}
        >
          Next
        </button>

        {/* Items per page */}
        <div className="flex items-center ml-6 space-x-2">
          <span className="text-gray-700">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              dispatch(setHistoryQuestionsLimit(+e.target.value));
              dispatch(setHistoryQuestionsPage(1));
            }}
            className="px-2 py-1 bg-gray-300 rounded border border-gray-400 focus:outline-none"
          >
            {[1, 5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TranslatedQuestions;
