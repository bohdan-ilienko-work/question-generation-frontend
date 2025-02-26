import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import GeneratedQuestionList from "../components/QuestionGeneration/QuestionList";
import { useGetGeneratedQuestionsQuery } from "../state/api/questionsApi";
import { Question } from "../types/Question.interface";
import { RootState } from "../store";
import {
  setGeneratedQuestionsPage,
  setGeneratedQuestionsLimit,
  setGeneratedQuestionsTotalPages,
} from "../state/questionsSlice";

const GeneratedQuestions = () => {
  const dispatch = useDispatch();

  // Основные параметры
  const limit = useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters.limit
  );
  const page = useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters.page
  );
  const totalPages = useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters.totalPages
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

  // Получение вопросов
  const { data, error, isLoading, refetch } = useGetGeneratedQuestionsQuery({
    limit,
    page,
  });

  // Флаг, чтобы не запускать рефетч при первом рендере
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      console.log("Applying filters:", filters);
      refetch();
    }
    isFirstRender.current = false;
  }, [limit, page, filters]);

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
      {/* Фильтры */}
      <div className="bg-white p-4 rounded-md shadow-md flex flex-wrap gap-4 items-center">
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

      {/* Список вопросов */}
      <GeneratedQuestionList
        questions={data?.responseObject.questions as Question[]}
      />

      {/* Pagination */}
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
              dispatch(setGeneratedQuestionsTotalPages(1));
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {/* TODO: remove first option (1) before production */}
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

export default GeneratedQuestions;
