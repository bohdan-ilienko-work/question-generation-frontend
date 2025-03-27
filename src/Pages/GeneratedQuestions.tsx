import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useGetGeneratedQuestionsQuery } from "../state/api/questionsApi";
import { Question } from "../types";
import {
  setGeneratedQuestionsPage,
  setGeneratedQuestionsLimit,
  useSelectGeneratedQuestionsFilters,
} from "../state";
import { Edit2 } from "lucide-react";
import {
  useConfirmGeneratedQuestionMutation,
  useRejectGeneratedQuestionMutation,
  useConfirmGeneratedQuestionsMutation,
  useRejectGeneratedQuestionsMutation,
} from "../state/api/questionsApi";
import { useNavigate } from "react-router-dom";
import MapWithMarker from "../components/MapWithMarker";
import Loader from "../components/Loader";

const GeneratedQuestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { limit, page, totalPages } = useSelectGeneratedQuestionsFilters();

  const { data, error, isLoading, refetch } = useGetGeneratedQuestionsQuery({
    limit,
    page,
  });

  const isFirstRender = useRef(true);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );

  // Фильтры (мокнутые)
  const [filters, setFilters] = useState({
    category: "",
    title: "",
    difficulty: "",
    status: "",
    localeIncluded: "",
    localeExcluded: "",
    tags: "",
  });
  useEffect(() => {
    if (!isFirstRender.current) {
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page]);

  const [confirmQuestion] = useConfirmGeneratedQuestionMutation();
  const [rejectQuestion] = useRejectGeneratedQuestionMutation();

  const [confirmQuestions] = useConfirmGeneratedQuestionsMutation();
  const [rejectQuestions] = useRejectGeneratedQuestionsMutation();

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
    <div className="flex flex-col items-center space-y-2 w-full">
      {/* Фильтры */}
      <div className="bg-white p-2 rounded-md shadow-md flex flex-wrap gap-4 items-center">
        {/* Фильтр по категории */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="science">Science</option>
            <option value="art">Art</option>
            <option value="history">History</option>
          </select>
        </div>

        {/* Фильтр по названию вопроса */}
        <div>
          <label className="block text-sm font-medium">Question Title</label>
          <input
            type="text"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="Enter question title..."
          />
        </div>
        {/* Фильтр по дате генерации (до и после) */}
        <div>
          <label className="block text-sm font-medium">Generated After</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            placeholder="Enter date..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Generated Before</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            placeholder="Enter date..."
          />
        </div>

        {/* Фильтр по температуре (не контроллируемый компонент) */}
        <div>
          <label className="block text-sm font-medium">Temperature</label>
          <input
            type="number"
            min="0"
            max="2"
            step=".1"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Фильтр по сложности */}
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
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

        {/* Фильтр по статусу */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Фильтр: Локаль должна быть в вопросе */}
        <div>
          <label className="block text-sm font-medium">Must have locale</label>
          <select
            value={filters.localeIncluded}
            onChange={(e) =>
              setFilters({ ...filters, localeIncluded: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">Any</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Фильтр: Локаль НЕ должна быть в вопросе */}
        <div>
          <label className="block text-sm font-medium">
            Must NOT have locale
          </label>
          <select
            value={filters.localeExcluded}
            onChange={(e) =>
              setFilters({ ...filters, localeExcluded: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">None</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Фильтр по тегам */}
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <input
            type="text"
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="Enter tags (comma separated)..."
          />
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
      <h3 className="text-lg font-semibold">Generated Questions</h3>
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
              <th className="border border-gray-300 px-4 py-2 w-1/7">
                Actions
              </th>
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
                  <td className="border border-gray-300 px-4 py-2 grid grid-cols-2 gap-4">
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
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                      onClick={() =>
                        navigate(`/edit-generated-question/${questionId}`)
                      }
                    >
                      Edit <Edit2 size={16} />
                    </button>
                    {question.source && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        onClick={() => window.open(question.source, "_blank")}
                      >
                        Source
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Пагинация */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            dispatch(setGeneratedQuestionsPage(page > 1 ? page - 1 : 1))
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
          onClick={() => dispatch(setGeneratedQuestionsPage(page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>

        <div className="px-4 py-2 bg-gray-300 rounded">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              dispatch(setGeneratedQuestionsLimit(+e.target.value));
              dispatch(setGeneratedQuestionsPage(1));
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
