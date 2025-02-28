import { useDispatch } from "react-redux";
import { useGetQuestionsHistoryQuery } from "../state/api/questionsApi";
import {
  setHistoryQuestionsDifficulty,
  setHistoryQuestionsLimit,
  setHistoryQuestionsPage,
  setHistoryQuestionsStatus,
  setHistoryQuestionsTitle,
  setHistoryQuestionsType,
  useSelectHistoryQuestionsFilters,
} from "../state";
import { useEffect, useRef } from "react";
import { Question } from "../types";
import GeneratedQuestionList from "../components/QuestionGeneration/QuestionList";
import { QuestionType } from "../types/enums/QuestionType.enum";
import { QuestionStatus } from "../types/types/QuestionStatus.type";

const QuestionsHistory = () => {
  const dispatch = useDispatch();

  const { limit, page, totalPages, difficulty, type, title, status } =
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );

  if (error) {
    return (
      <p>
        Error:{" "}
        {error && "data" in error
          ? (error.data as { message: string }).message
          : "An error occurred"}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
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
            <option value="multiple_choice">Multiple Choice</option>
            <option value="one_choice">One Choice</option>
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

      {/* Question list */}
      <GeneratedQuestionList
        editPath="/edit-question"
        questions={data?.responseObject.questions as Question[]}
      />

      {/* Pagination */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            dispatch(setHistoryQuestionsPage(page > 1 ? page - 1 : 1))
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
            dispatch(setHistoryQuestionsPage(page < totalPages ? page + 1 : 1))
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
              dispatch(setHistoryQuestionsLimit(+e.target.value));
              dispatch(setHistoryQuestionsPage(1));
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

export default QuestionsHistory;
