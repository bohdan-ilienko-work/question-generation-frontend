import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Question } from "../types/Question.interface";
import {
  useGetOneQuestionQuery,
  useUpdateQuestionMutation,
} from "../state/api/questionsApi";

// 🔹 Универсальный компонент для инпутов
const FormInput = ({
  label,
  name,
  control,
  type = "text",
  placeholder = "",
  options = [],
}: {
  label: string;
  name: keyof Question;
  control: any;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        options.length > 0 ? (
          <select {...field} className="w-full p-2 border rounded-md">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className="w-full p-2 border rounded-md"
          />
        )
      }
    />
  </div>
);

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 🔹 Фетч данных с сервера
  const { data: question, error, isLoading } = useGetOneQuestionQuery(id!);
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();

  // 🔹 Инициализация формы
  const { control, handleSubmit, reset } = useForm<Question>({
    defaultValues: question?.responseObject,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locales",
  });

  // 🔹 Заполняем форму, когда приходят данные
  useEffect(() => {
    if (question) reset(question.responseObject);
  }, [question, reset]);

  const onSubmit = async (data: Question) => {
    try {
      await updateQuestion(data).unwrap();
      navigate("/questions-history");
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching question</p>;
  if (!question) return <p>Question not found</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Question: {id}</h2>
        {/* 🔹 Кнопка возврата */}
        <button
          onClick={() => navigate("/questions-history")}
          className="flex items-center space-x-2 text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v1.586l1.707-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 5.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to History</span>
        </button>
      </div>

      {/* 🔹 Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Category" name="categoryId" control={control} />
          <FormInput
            label="Status"
            name="status"
            control={control}
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
          <FormInput
            label="Difficulty"
            name="difficulty"
            control={control}
            type="number"
          />
          <FormInput
            label="Type"
            name="type"
            control={control}
            options={[
              { value: "one_choice", label: "One Choice" },
              { value: "multiple_choice", label: "Multiple Choice" },
            ]}
          />
          <FormInput label="Audio ID" name="audioId" control={control} />
          <FormInput label="Image ID" name="imageId" control={control} />
          <FormInput label="Author ID" name="authorId" control={control} />
          <FormInput
            label="Tags"
            name="tags"
            control={control}
            placeholder="Comma separated"
          />
          <FormInput
            label="Required Languages"
            name="requiredLanguages"
            control={control}
            placeholder="Comma separated"
          />
        </div>

        {/* 🔹 Локали */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Locales</h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((locale, index) => (
              <div key={locale.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">
                    {locale.language.toUpperCase()}
                  </h4>
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>

                <FormInput
                  label="Question"
                  name={`locales.${index}.question` as keyof Question}
                  control={control}
                />
                <FormInput
                  label="Correct Answer"
                  name={`locales.${index}.correct` as keyof Question}
                  control={control}
                />

                <div className="flex justify-between items-center mt-2">
                  <label className="block text-sm font-medium">
                    Wrong Answers
                  </label>
                  <button
                    type="button"
                    className="text-blue-500 text-sm"
                    onClick={() => {
                      append({ ...locale, wrong: [...locale.wrong, ""] });
                    }}
                  >
                    + Add Wrong Answer
                  </button>
                </div>

                {locale.wrong.map((_, wIndex) => (
                  <Controller
                    key={wIndex}
                    name={`locales.${index}.wrong.${wIndex}`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border rounded-md mt-1"
                      />
                    )}
                  />
                ))}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 p-2 bg-green-500 text-white rounded-md"
            onClick={() =>
              append({
                language: "new",
                question: "",
                correct: "",
                wrong: [],
                isValid: false,
              })
            }
          >
            + Add Locale
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
          disabled={isUpdating}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
