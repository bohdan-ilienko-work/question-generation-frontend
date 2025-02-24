import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import GeneratedQuestionList from "../components/QuestionGeneration/QuestionList";
import { useGetGeneratedQuestionsQuery } from "../state/api/questionsApi";
import { Question } from "../types/Question.interface";
import { RootState } from "../store";
import { setPage, setLimit } from "../state/questionsSlice";

const GeneratedQuestions = () => {
  const dispatch = useDispatch();

  const limit = useSelector((state: RootState) => state.questions.limit);
  const page = useSelector((state: RootState) => state.questions.page);
  const totalPages = useSelector(
    (state: RootState) => state.questions.totalPages
  );

  const { data, error, isLoading, refetch } = useGetGeneratedQuestionsQuery({
    limit,
    page,
  });

  // Флаг, чтобы не запускать рефетч при первом рендере
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page]);

  if (isLoading) return <p>Loading...</p>;

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
          onClick={() => dispatch(setPage(page > 1 ? page - 1 : 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>

        <div className="px-4 py-2 bg-gray-300 rounded">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              dispatch(setLimit(+e.target.value));
              dispatch(setPage(1));
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

export default GeneratedQuestions;
