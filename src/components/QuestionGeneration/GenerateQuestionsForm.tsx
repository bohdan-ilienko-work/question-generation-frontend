import React from "react";
import InputField from "./InputField";
import {
  useCategoriesFilters,
  useGetCategoriesQuery,
  setCategoriesLimit,
  setCategoriesTitle,
  setCategoriesPage,
} from "../../state";
import { useDispatch } from "react-redux";
import CategoryDropdown from "../CategoryDropdown";
import { Category } from "../../types";

interface GenerateQuestionsFormProps {
  state: {
    category: Category | null;
    // max_tokens: number;
    count: number;
    temperature: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    type: "multiple_choice" | "one_choice";
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

  const handleInputChange = (
    name: string,
    value: string | number | Category
  ) => {
    dispatch({
      type: "SET_VALUE",
      field: name as "category" | "count",
      value,
    });
  };
  const handleCheckboxChange = (locale: string) => {
    const updatedLocales = state.requiredLanguages.includes(locale)
      ? state.requiredLanguages.filter((l) => l !== locale)
      : [...state.requiredLanguages, locale];

    if (updatedLocales.length === 0) {
      updatedLocales.push("en");
    }

    dispatch({
      type: "SET_VALUE",
      field: "requiredLanguages",
      value: updatedLocales,
    });
  };

  return (
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
          handlePageChange={(page) => reduxDispatch(setCategoriesPage(page))}
          handleTitleChange={(title) =>
            reduxDispatch(setCategoriesTitle(title))
          }
          page={page}
          limit={limit}
          totalPages={totalPages}
          title={title}
        />
      </div>

      {/* <InputField
        label="Max Tokens"
        name="max_tokens"
        type="number"
        value={state.max_tokens}
        onChange={handleInputChange}
      /> */}

      <InputField
        label="Count"
        name="count"
        type="number"
        value={state.count}
        onChange={handleInputChange}
      />
      <InputField
        label="Temperature"
        name="temperature"
        type="number"
        value={state.temperature}
        onChange={handleInputChange}
        options={{
          min: 0,
          max: 2,
          step: 0.1,
        }}
      />

      <InputField
        label="Difficulty"
        name="difficulty"
        type="select"
        value={state.difficulty}
        selectOptions={[1, 2, 3, 4, 5]}
        onChange={handleInputChange}
      />

      <InputField
        label="Type"
        name="type"
        type="select"
        value={state.type}
        // selectOptions={["one_choice", "multiple_choice"]}
        selectOptions={["one_choice"]}
        onChange={handleInputChange}
      />

      <InputField
        label="Model"
        name="model"
        type="select"
        value={state.model}
        selectOptions={[
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
        ]}
        onChange={handleInputChange}
      />

      {/* Required Locales */}
      <div className="flex flex-col">
        <label className="font-semibold">Required Locales</label>
        <div className="grid grid-cols-6 gap-2">
          {["en", "es", "fr", "de", "uk", "zh"].map((locale) => (
            <label key={locale} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={state.requiredLanguages.includes(locale)}
                onChange={() => handleCheckboxChange(locale)}
                className="rounded border-gray-400 text-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              <span>{locale}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateQuestionsForm;
