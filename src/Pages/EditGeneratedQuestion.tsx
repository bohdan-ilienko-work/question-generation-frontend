//Pages/EditGeneratedQuestion.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOneGeneratedQuestionQuery,
  useTranslateGeneratedQuestionMutation,
  useUpdateGeneratedQuestionMutation,
} from "../state/api/questionsApi";
import { Question } from "../types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import EditQuestionFormInput from "../components/EditQuestion/EditQuestionFormInput";

const EditGeneratedQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: generatedQuestion,
    isLoading,
    error,
  } = useGetOneGeneratedQuestionQuery(id!);
  const [updateGeneratedQuestion, { isLoading: isUpdating }] =
    useUpdateGeneratedQuestionMutation();

  const [translateQuestion] = useTranslateGeneratedQuestionMutation();

  const { control, handleSubmit, reset } = useForm<Question>({
    defaultValues: generatedQuestion?.responseObject,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locales",
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleTranslate = async () => {
    if (!selectedLanguage) return alert("Select a language!");

    try {
      const response = await translateQuestion({
        questionId: id!,
        language: selectedLanguage,
      }).unwrap();

      //   console.log("Translation response:", response);

      // 🔹 Добавляем новый перевод в locales
      append({
        language: selectedLanguage,
        question: response.responseObject.question,
        correct: response.responseObject.correct,
        wrong: response.responseObject.wrong || [],
        isValid: false,
      });

      setSelectedLanguage(""); // Сбросить выбранный язык
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleAddWrongAnswer = (index: number) => {
    const locale = fields[index];
    append({ ...locale, wrong: [...(locale.wrong || []), ""] });
    remove(index);
  };

  const handleRemoveWrongAnswer = (localeIndex: number, wrongIndex: number) => {
    const locale = fields[localeIndex];
    const updatedWrong = locale.wrong.filter((_, i) => i !== wrongIndex);
    append({ ...locale, wrong: updatedWrong });
    remove(localeIndex);
  };

  useEffect(() => {
    if (generatedQuestion) {
      reset(generatedQuestion.responseObject);
    }
  }, [generatedQuestion, reset]);

  const onSubmit = async (data: Question) => {
    try {
      await updateGeneratedQuestion(data).unwrap();
      navigate("/questions/generated-questions");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching question</p>;
  if (!generatedQuestion) return <p>No question found</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Question: {id}</h2>
        {/* 🔹 Кнопка возврата */}
        <button
          onClick={() => navigate("/questions-history")}
          className="flex items-center space-x-2 text-blue-500"
        >
          <img
            src="/back-arrow-svgrepo-com.svg"
            alt="Back"
            className="h-5 w-5"
          />
          <span>Back to History</span>
        </button>
      </div>

      {/* 🔹 Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <EditQuestionFormInput
            label="Category"
            name="categoryId"
            control={control}
          />
          <EditQuestionFormInput
            label="Status"
            name="status"
            control={control}
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
          <EditQuestionFormInput
            label="Difficulty"
            name="difficulty"
            control={control}
            type="number"
          />
          <EditQuestionFormInput
            label="Type"
            name="type"
            control={control}
            options={[
              { value: "one_choice", label: "One Choice" },
              { value: "multiple_choice", label: "Multiple Choice" },
            ]}
          />
          <EditQuestionFormInput
            label="Audio ID"
            name="audioId"
            control={control}
          />
          <EditQuestionFormInput
            label="Image ID"
            name="imageId"
            control={control}
          />
          <EditQuestionFormInput
            label="Author ID"
            name="authorId"
            control={control}
          />
          <EditQuestionFormInput
            label="Tags"
            name="tags"
            control={control}
            placeholder="Comma separated"
          />
          <EditQuestionFormInput
            label="Required Languages"
            name="requiredLanguages"
            control={control}
            placeholder="Comma separated"
          />

          {/* 🔹 Блок для перевода */}
          <div>
            <label className="block text-sm font-medium">Translate to</label>
            <div className="flex space-x-4 justify-between items-center">
              <img
                src="/deepl-svgrepo-com.svg"
                alt="DeepL"
                className="h-8 w-8"
              />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">Select Language</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="uk">Ukrainian</option>
              </select>
              <button
                type="button"
                className="p-2 bg-blue-500 text-white rounded-md"
                onClick={handleTranslate}
              >
                Translate
              </button>
            </div>
          </div>
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

                <EditQuestionFormInput
                  label="Question"
                  name={`locales.${index}.question` as keyof Question}
                  control={control}
                />
                <EditQuestionFormInput
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
                      handleAddWrongAnswer(index);
                    }}
                  >
                    + Add Wrong Answer
                  </button>
                </div>

                {locale.wrong?.map((_, wIndex) => (
                  <div key={wIndex} className="flex items-center mt-2">
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
                    {/* нужна кнопка для удаления неправильного ответа с иконкой мусорного бака */}
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        handleRemoveWrongAnswer(index, wIndex);
                      }}
                    >
                      <img
                        src="/trash-xmark-alt-svgrepo-com.svg"
                        alt="Delete"
                        className="h-8 w-8"
                      />
                    </button>
                  </div>
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

export default EditGeneratedQuestion;
