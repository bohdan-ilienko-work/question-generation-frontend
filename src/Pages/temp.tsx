import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Question } from "../types/Question.interface";
import { QuestionType } from "../types/QuestionType.enum";
import {
  useGetOneQuestionQuery,
  useUpdateQuestionMutation,
} from "../state/api/questionsApi";

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Получаем ID вопроса из URL

  const { data: question, error, isLoading } = useGetOneQuestionQuery(id!);

  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();

  const { control, handleSubmit, reset } = useForm<Question>({
    defaultValues: question?.responseObject,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locales",
  });

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-2 border rounded-md"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border rounded-md">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="5"
                  className="w-full p-2 border rounded-md"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border rounded-md">
                  <option value="one_choice">One Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Локали */}
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

                <label className="block text-sm font-medium">Question</label>
                <Controller
                  name={`locales.${index}.question`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border rounded-md"
                    />
                  )}
                />

                <label className="block text-sm font-medium mt-2">
                  Correct Answer
                </label>
                <Controller
                  name={`locales.${index}.correct`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border rounded-md"
                    />
                  )}
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
