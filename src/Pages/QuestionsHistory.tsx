import { useDispatch } from "react-redux";
import {
  useConfirmQuestionMutation,
  useConfirmQuestionsMutation,
  useGetQuestionsHistoryQuery,
  useRejectQuestionMutation,
  useRejectQuestionsMutation,
} from "../state/api/questionsApi";
import {
  setHistoryQuestionsDifficulty,
  setHistoryQuestionsLimit,
  setHistoryQuestionsPage,
  setHistoryQuestionsStatus,
  setHistoryQuestionsTitle,
  setHistoryQuestionsType,
  useSelectHistoryQuestionsFilters,
} from "../state";
import { useEffect, useRef, useState } from "react";
import { Question } from "../types";
// import GeneratedQuestionList from "../components/QuestionGeneration/QuestionList";
import { QuestionType } from "../types/enums/QuestionType.enum";
import { QuestionStatus } from "../types/types/QuestionStatus.type";
import Loader from "../components/Loader";
import { Edit2 } from "lucide-react";
import MapWithMarker from "../components/MapWithMarker";
import { useNavigate } from "react-router-dom";

const QuestionsHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmQuestions] = useConfirmQuestionsMutation();
  const [confirmQuestion] = useConfirmQuestionMutation();

  const [rejectQuestions] = useRejectQuestionsMutation();
  const [rejectQuestion] = useRejectQuestionMutation();

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

  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );

  const toggleSelection = (id: string) => {
    setSelectedQuestions((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page, difficulty, type, title, refetch]);

  const handleBulkConfirm = () => {
    confirmQuestions(Array.from(selectedQuestions));
    setSelectedQuestions(new Set());
  };

  const handleBulkReject = () => {
    rejectQuestions(Array.from(selectedQuestions));
    setSelectedQuestions(new Set());
  };

  if (isLoading) return <Loader />;

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

      {selectedQuestions.size > 0 && (
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-md"
            onClick={handleBulkConfirm}
          >
            Accept Selected
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md"
            onClick={handleBulkReject}
          >
            Reject Selected
          </button>
        </div>
      )}
      {/* Таблица */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedQuestions(
                        new Set(
                          data?.responseObject.questions.map(
                            (q: Question) => q._id
                          )
                        )
                      );
                    } else {
                      setSelectedQuestions(new Set());
                    }
                  }}
                  checked={
                    selectedQuestions.size ===
                    data?.responseObject.questions.length
                  }
                />
              </th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Question
              </th>
              <th className="border border-gray-300 px-4 py-2">Answers</th>
              <th className="border border-gray-300 px-4 py-2">Difficulty</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.responseObject.questions.map((question: Question) => {
              const questionId = question._id;

              return (
                <tr key={questionId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(questionId)}
                      onChange={() => toggleSelection(questionId)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {questionId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {question.locales[0].question}
                  </td>

                  {/* Conditional rendering for map or text answers */}
                  <td className="border border-gray-300 px-4 py-2 w-1/4">
                    {question.type === "map" ? (
                      <MapWithMarker
                        position={[
                          Number(question.locales[0].correct[0]),
                          Number(question.locales[0].correct[1]),
                        ]}
                      />
                    ) : (
                      <ul className="list-none grid grid-cols-2 gap-4">
                        <li className="font-bold text-green-600">
                          ✔ {question.locales[0].correct}
                        </li>
                        {question.locales[0].wrong?.map((answer, idx) => (
                          <li key={idx}>✗ {answer}</li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {question.difficulty}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {question.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {question.type.replace("_", " ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex items-center justify-center space-x-2">
                    <button
                      className="bg-orange-500 text-white px-3 py-1 rounded-md"
                      onClick={() => confirmQuestion(questionId)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                      onClick={() => rejectQuestion(questionId)}
                    >
                      Reject
                    </button>
                    <Edit2
                      size={22}
                      className="text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => navigate(`/edit-question/${questionId}`)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
