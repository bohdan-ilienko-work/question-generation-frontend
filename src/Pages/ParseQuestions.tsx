import { useReducer } from "react";
import { Card, Form, Select, Button, Row, Col, Input } from "antd";
import CategoryDropdown from "../components/CategoryDropdown";
import { useDispatch } from "react-redux";
import {
  setCategoriesLimit,
  setCategoriesPage,
  setCategoriesTitle,
  useCategoriesFilters,
  useGetCategoriesQuery,
  useParseQuestionsMutation,
} from "../state";
import { Category, QuestionType } from "../types";
import ErrorMessage from "../components/QuestionGeneration/ErrorMessage";
import TokensUsed from "../components/QuestionGeneration/TokensUsed";
import { NavLink } from "react-router-dom";

const { TextArea } = Input;

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

const languageOptions = [
  { label: "en", value: "en" },
  { label: "es", value: "es" },
  { label: "fr", value: "fr" },
  { label: "de", value: "de" },
  { label: "uk", value: "uk" },
  { label: "zh", value: "zh" },
];

const typeOptions = [
  { label: "choice", value: "choice" },
  { label: "map", value: "map" },
];

const ParseQuestions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [parseQuestions, { isLoading }] = useParseQuestionsMutation();
  const { page, limit, title, totalPages } = useCategoriesFilters();
  const reduxDispatch = useDispatch();

  const { data: categories } = useGetCategoriesQuery(
    { page, limit, title },
    { refetchOnMountOrArgChange: true }
  );

  const handleInputChange = (field: keyof IParseQuestions, value: any) => {
    dispatch({ type: "SET_VALUE", field, value });
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
        categoryId:
          typeof state.category?._id === "number" ? state.category._id : 0,
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
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 32,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 820,
          borderRadius: 16,
          marginBottom: 32,
          boxShadow: "0 2px 16px #0000000d",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Form layout="vertical">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Category" required>
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
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Language" required>
                <Select
                  value={state.language}
                  onChange={(val) => handleInputChange("language", val)}
                  options={languageOptions}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Type" required>
                <Select
                  value={state.type}
                  onChange={(val) => handleInputChange("type", val)}
                  options={typeOptions}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        style={{
          width: "100%",
          maxWidth: 820,
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: "0 2px 12px #00000010",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Form layout="vertical">
          <Form.Item>
            <TextArea
              rows={8}
              style={{ resize: "none", fontSize: 15 }}
              value={state.boilerplateText}
              onChange={(e) =>
                dispatch({
                  type: "SET_VALUE",
                  field: "boilerplateText",
                  value: e.target.value,
                })
              }
              placeholder="Enter your prompt..."
              autoSize={{ minRows: 8, maxRows: 14 }}
            />
          </Form.Item>
        </Form>
      </Card>

      <Button
        type="primary"
        block
        style={{
          maxWidth: 820,
          height: 44,
          fontSize: 17,
          borderRadius: 8,
          background: "#1769ff",
          marginBottom: 18,
          fontWeight: 500,
        }}
        onClick={handleParse}
        loading={isLoading}
        disabled={isLoading}
      >
        Generate
      </Button>

      <div style={{ width: "100%", maxWidth: 820 }}>
        <ErrorMessage error={state.error ?? ""} />
        <TokensUsed tokensUsed={state.tokensUsed} />
        {state.isGenerated && (
          <NavLink
            to="/generated-questions"
            style={{
              background: "#ff6600",
              color: "#fff",
              fontSize: 17,
              fontWeight: 600,
              borderRadius: 8,
              padding: "10px 24px",
              display: "inline-flex",
              alignItems: "center",
              marginTop: 18,
              textDecoration: "none",
            }}
          >
            View Questions
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: 12 }}
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width={28}
              height={28}
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
    </div>
  );
};

export default ParseQuestions;
