import { useDispatch, useSelector } from "react-redux";
import { useGetQuestionsHistoryQuery } from "../state/api/questionsApi";
import {
  setHistoryQuestionsLimit,
  setHistoryQuestionsTotalPages,
} from "../state/questionsSlice";
import { RootState } from "../store";
import { useEffect, useRef } from "react";
import { Question } from "../types/Question.interface";
import GeneratedQuestionList from "../components/QuestionGeneration/QuestionList";
const QuestionsHistory = () => {
  const dispatch = useDispatch();

  const limit = useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters.limit
  );
  const page = useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters.page
  );
  const totalPages = useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters.totalPages
  );

  const { data, isLoading, error, refetch } = useGetQuestionsHistoryQuery({
    limit,
    page,
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page]);

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
      <GeneratedQuestionList
        questions={data?.responseObject.questions as Question[]}
      />

      {/* Pagination */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            dispatch(setHistoryQuestionsLimit(page > 1 ? page - 1 : 1))
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
          onClick={() => dispatch(setHistoryQuestionsLimit(page + 1))}
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
              dispatch(setHistoryQuestionsTotalPages(1));
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
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
