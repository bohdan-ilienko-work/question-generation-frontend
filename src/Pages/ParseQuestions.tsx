import { useReducer } from "react";
import { Category, QuestionType } from "../types";
import {
  setCategoriesLimit,
  setCategoriesPage,
  setCategoriesTitle,
  useCategoriesFilters,
  useGetCategoriesQuery,
  useParseQuestionsMutation,
} from "../state";
import CategoryDropdown from "../components/CategoryDropdown";
import { useDispatch } from "react-redux";
import InputField from "../components/QuestionGeneration/InputField";
import ErrorMessage from "../components/QuestionGeneration/ErrorMessage";
import TokensUsed from "../components/QuestionGeneration/TokensUsed";
import { NavLink } from "react-router-dom";

interface IParseQuestions {
  category: Category | null;
  boilerplateText: string;
  language: string;
  type: QuestionType;
  error?: string | null;
  isGenerated: boolean;
  tokensUsed: number;
}

const initialState: IParseQuestions = {
  category: null,
  boilerplateText: "",
  type: QuestionType.OneChoice,
  language: "en",
  error: null,
  isGenerated: false,
  tokensUsed: 0,
};

type Action =
  | {
      type: "SET_VALUE";
      field: keyof IParseQuestions;
      value: string | Category;
    }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_BOILERPLATE_TEXT" }
  | { type: "SET_IS_GENERATED"; isGenerated: boolean };

const reducer = (state: IParseQuestions, action: Action): IParseQuestions => {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "CLEAR_BOILERPLATE_TEXT":
      return { ...state, boilerplateText: "" };
    case "SET_IS_GENERATED":
      return { ...state, isGenerated: action.isGenerated };
    default:
      return state;
  }
};

const ParseQuestions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [parseQuestions, { isLoading }] = useParseQuestionsMutation();
  const { page, limit, title, totalPages } = useCategoriesFilters();
  const reduxDispatch = useDispatch();

  const { data: categories } = useGetCategoriesQuery(
    { page, limit, title },
    { refetchOnMountOrArgChange: true }
  );
  const handleInputChange = (name: string, value: string | Category) => {
    dispatch({
      type: "SET_VALUE",
      field: name as keyof IParseQuestions,
      value,
    });
  };
  const handleParse = async () => {
    if (!state.boilerplateText.trim()) {
      dispatch({
        type: "SET_ERROR",
        error: "Boilerplate text cannot be empty",
      });
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await parseQuestions({
        boilerplateText: state.boilerplateText,
        categoryId: state.category?._id || "",
        language: state.language,
        type: state.type,
      }).unwrap();

      dispatch({ type: "SET_IS_GENERATED", isGenerated: true });
      dispatch({ type: "CLEAR_BOILERPLATE_TEXT" });
      dispatch({ type: "SET_ERROR", error: null });

      dispatch({
        type: "SET_VALUE",
        field: "tokensUsed",
        value: response.responseObject.totalTokensUsed,
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to parse questions" });
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Category</label>

            <CategoryDropdown
              categories={categories?.responseObject.categories || []}
              selectedCategory={state.category}
              setSelectedCategory={(category) =>
                handleInputChange("category", category)
              }
              handleLimitChange={(limit) =>
                reduxDispatch(setCategoriesLimit(limit))
              }
              handlePageChange={(page) =>
                reduxDispatch(setCategoriesPage(page))
              }
              handleTitleChange={(title) =>
                reduxDispatch(setCategoriesTitle(title))
              }
              page={page}
              limit={limit}
              totalPages={totalPages}
              title={title}
            />
          </div>
          <InputField
            label="Language"
            name="language"
            type="select"
            value={state.language}
            selectOptions={["en", "es", "fr", "de", "uk", "zh"]}
            onChange={(e) => handleInputChange("language", e)}
          />

          <InputField
            label="Type"
            name="type"
            type="select"
            value={state.type}
            selectOptions={["choice", "map"]}
            onChange={(e) => handleInputChange("type", e)}
          />
        </div>
      </div>
      <div className="mt-6 w-full max-w-3xl">
        <div className="border border-gray-400 p-4 flex justify-between items-center bg-white rounded-md">
          <textarea
            // type="textarea"
            rows={10}
            //убери возможность resize
            style={{ resize: "none" }}
            value={state.boilerplateText}
            onChange={(e) =>
              dispatch({
                type: "SET_VALUE",
                field: "boilerplateText",
                value: e.target.value,
              })
            }
            placeholder="Enter your prompt..."
            className="w-full p-2 border-none outline-none bg-transparent text-black"
          />
        </div>
      </div>

      <button
        onClick={handleParse}
        className={`text-white p-2 rounded-md flex items-center gap-2 mt-4 ${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        }`}
        disabled={isLoading}
      >
        Generate
        {isLoading ? (
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
        ) : null}
      </button>

      <ErrorMessage error={state.error ?? ""} />
      <TokensUsed tokensUsed={state.tokensUsed} />
      {state.isGenerated && (
        <NavLink
          to="/generated-questions"
          className="bg-orange-500 text-white text-md font-semibold px-6 py-2 rounded-md mt-4 flex items-center gap-2"
        >
          View Questions
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NavLink>
      )}
    </div>
  );
};

export default ParseQuestions;
