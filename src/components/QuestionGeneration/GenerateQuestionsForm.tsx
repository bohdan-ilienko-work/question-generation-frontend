import React from "react";
import { Form, Select, InputNumber, Checkbox, Row, Col } from "antd";
import CategoryDropdown from "../CategoryDropdown";
import { Category } from "../../types";
import {
  useCategoriesFilters,
  useGetCategoriesQuery,
  setCategoriesLimit,
  setCategoriesTitle,
  setCategoriesPage,
} from "../../state";
import { useDispatch } from "react-redux";


const localeOptions = [
  { label: "en", value: "en" },
  { label: "es", value: "es" },
  { label: "fr", value: "fr" },
  { label: "de", value: "de" },
  { label: "uk", value: "uk" },
  { label: "zh", value: "zh" },
];

interface GenerateQuestionsFormProps {
  state: {
    category: Category | null;
    count: number;
    temperature: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    type: "map" | "choice";
    model:
    | "gpt-3.5-turbo"
    | "gpt-4-turbo"
    | "gpt-4"
    | "gpt-4o"
    | "gpt-4o-mini"
    | "o1"
    | "o1-mini"
    | "o3"
    | "o3-mini"
    | "gpt-4.5"
    | "gpt-5";
    requiredLanguages: string[];
  };
  dispatch: React.Dispatch<{
    type: "SET_VALUE";
    field:
    | "category"
    | "count"
    | "temperature"
    | "difficulty"
    | "type"
    | "model"
    | "requiredLanguages";
    value: string | number | string[] | Category;
  }>;
}

const GenerateQuestionsForm: React.FC<GenerateQuestionsFormProps> = ({
  state,
  dispatch,
}) => {
  const { page, limit, title, totalPages } = useCategoriesFilters();
  const reduxDispatch = useDispatch();

  const { data: categories } = useGetCategoriesQuery(
    { page, limit, title },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <Form
      layout="vertical"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 32,
        boxShadow: "0 2px 12px #00000010",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item label="Category" required>
            <CategoryDropdown
              categories={categories?.responseObject.categories || []}
              selectedCategory={state.category}
              setSelectedCategory={(category) =>
                dispatch({ type: "SET_VALUE", field: "category", value: category })
              }
              handleLimitChange={(limit) => reduxDispatch(setCategoriesLimit(limit))}
              handlePageChange={(page) => reduxDispatch(setCategoriesPage(page))}
              handleTitleChange={(title) => reduxDispatch(setCategoriesTitle(title))}
              page={page}
              limit={limit}
              totalPages={totalPages}
              title={title}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Count" required>
            <InputNumber
              min={1}
              max={50}
              style={{ width: "100%" }}
              value={state.count}
              onChange={(val) =>
                dispatch({ type: "SET_VALUE", field: "count", value: val || 1 })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Temperature" required>
            <InputNumber
              min={0}
              max={2}
              step={0.1}
              style={{ width: "100%" }}
              value={state.temperature}
              onChange={(val) =>
                dispatch({ type: "SET_VALUE", field: "temperature", value: val ?? 0 })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Difficulty" required>
            <Select
              value={state.difficulty}
              onChange={(value) =>
                dispatch({ type: "SET_VALUE", field: "difficulty", value })
              }
              options={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Type" required>
            <Select
              value={state.type}
              onChange={(value) =>
                dispatch({ type: "SET_VALUE", field: "type", value })
              }
              options={[
                { value: "choice", label: "choice" },
                { value: "map", label: "map" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Model" required>
            <Select
              value={state.model}
              onChange={(value) =>
                dispatch({ type: "SET_VALUE", field: "model", value })
              }
              options={[
                "gpt-3.5-turbo",
                "gpt-4-turbo",
                "gpt-4",
                "gpt-4o",
                "gpt-4o-mini",
                "o1",
                "o1-mini",
                "o3",
                "o3-mini",
                "gpt-4.5",
                "gpt-5",
              ].map((model) => ({ value: model, label: model }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Required Locales">
            <Checkbox.Group
              options={localeOptions}
              value={state.requiredLanguages}
              onChange={(checked) =>
                dispatch({
                  type: "SET_VALUE",
                  field: "requiredLanguages",
                  value: checked.length ? (checked as string[]) : ["en"],
                })
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default GenerateQuestionsForm;
