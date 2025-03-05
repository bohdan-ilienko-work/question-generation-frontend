import { useState } from "react";
import { Question } from "../types";
import {
  useTranslateQuestionMutation,
  useUpdateQuestionMutation,
} from "../state";
import { useNavigate } from "react-router-dom";

const TranslatedQuestionItem = ({
  question,
  index,
}: {
  question: Question;
  index: number;
}) => {
  const navigate = useNavigate();
  const [translateQuestion] = useTranslateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const [questionLocales, setQuestionLocales] = useState([...question.locales]);
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [editLocales, setEditLocales] = useState(false); // Флаг редактирования

  const handleTranslate = async (lang: string) => {
    try {
      setLoadingLanguage(lang);
      const response = await translateQuestion({
        questionId: question.id || question._id || "",
        language: lang,
      }).unwrap();

      if (response.responseObject) {
        setQuestionLocales((prev) => [
          ...prev,
          { ...response.responseObject, language: lang, isValid: false },
        ]);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoadingLanguage(null);
    }
  };

  const handleRemoveLocale = (lang: string) => {
    if (lang === question.locales[0]?.language) {
      alert("Cannot delete the base locale.");
      return;
    }
    setQuestionLocales((prev) =>
      prev.filter((locale) => locale.language !== lang)
    );
  };

  const handleEditChange = (
    lang: string,
    field: "question" | "correct" | "wrong",
    value: string,
    index?: number
  ) => {
    setQuestionLocales((prev) =>
      prev.map((locale) =>
        locale.language === lang
          ? {
              ...locale,
              [field]:
                field === "wrong" && index !== undefined
                  ? locale.wrong.map((w, i) => (i === index ? value : w))
                  : value,
            }
          : locale
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      await updateQuestion({
        ...question,
        id: question.id || question._id || "",
        locales: questionLocales,
      }).unwrap();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save question:", error);
      setSaveStatus("idle");
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 mb-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">
        Question {index + 1}: {questionLocales[0]?.question} (
        {questionLocales[0]?.question.length} symbols)
      </h3>

      {/* Таблица локалей */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Language</th>
            <th className="border border-gray-300 px-4 py-2">Question</th>
            <th className="border border-gray-300 px-4 py-2">Answers</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionLocales.map((locale, localeIndex) =>
            localeIndex === 0 || isExpanded ? (
              <tr
                key={locale.language}
                className={
                  localeIndex === 0 ? "bg-gray-100" : "hover:bg-gray-50"
                }
              >
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {locale.language.toUpperCase()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editLocales ? (
                    <input
                      type="text"
                      value={locale.question}
                      onChange={(e) =>
                        handleEditChange(
                          locale.language,
                          "question",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    locale.question
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul>
                    <li className="text-green-600 font-bold">
                      ✔{" "}
                      {editLocales ? (
                        <input
                          type="text"
                          value={locale.correct}
                          onChange={(e) =>
                            handleEditChange(
                              locale.language,
                              "correct",
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        locale.correct
                      )}
                      ({locale.correct.length} symbols)
                    </li>
                    {locale.wrong.map((option, idx) => (
                      <li key={idx}>
                        ✗{" "}
                        {editLocales ? (
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleEditChange(
                                locale.language,
                                "wrong",
                                e.target.value,
                                idx
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          option
                        )}
                        ({option.length} symbols)
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2 flex flex-col space-y-2">
                  {localeIndex !== 0 && (
                    <button
                      onClick={() => handleRemoveLocale(locale.language)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                  {localeIndex === 0 && (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/edit-question/${question.id || question._id}`
                          )
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        {saveStatus === "saving"
                          ? "Saving..."
                          : saveStatus === "saved"
                          ? "✔ Saved"
                          : "Save"}
                      </button>

                      <button
                        onClick={() => setEditLocales(!editLocales)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                      >
                        {editLocales ? "Done Editing" : "Edit Locales"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {/* Кнопка для раскрытия локалей */}
      {questionLocales.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-500 hover:underline"
        >
          {isExpanded ? "Hide Locales" : "Show Locales"}
        </button>
      )}

      {/* Кнопки перевода */}
      <div className="mt-4 flex space-x-2 items-center">
        <span className="text-gray-700 me-2">Question Locales:</span>
        {["ja", "tr", "cs", "uk", "ar", "en", "fr", "es", "de", "it"].map(
          (lang) => (
            <button
              key={lang}
              onClick={() => handleTranslate(lang)}
              disabled={loadingLanguage === lang}
              className={`px-2 py-1 border rounded ${
                questionLocales.some((locale) => locale.language === lang)
                  ? "bg-gray-400 text-black"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {loadingLanguage === lang ? "..." : lang.toUpperCase()}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TranslatedQuestionItem;
