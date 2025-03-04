import { useState, useEffect } from "react";
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
  const [selectedLocale, setSelectedLocale] = useState(
    question.locales[0]?.language || "en"
  );
  const [translateQuestion] = useTranslateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const [languages, setLanguages] = useState([
    "ja",
    "tr",
    "cs",
    "uk",
    "ar",
    "en",
    "fr",
    "es",
    "de",
    "it",
  ]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [questionLocales, setQuestionLocales] = useState([...question.locales]);
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  useEffect(() => {
    setAvailableLanguages(questionLocales.map((locale) => locale.language));
  }, [questionLocales]);

  const handleLocaleChange = async (lang: string) => {
    if (availableLanguages.includes(lang)) {
      setSelectedLocale(lang);
    } else {
      await handleTranslate(lang);
    }
  };

  const handleTranslate = async (lang: string) => {
    try {
      setLoadingLanguage(lang);
      const response = await translateQuestion({
        questionId: question.id || question._id || "",
        language: lang,
      }).unwrap();

      if (response.responseObject) {
        const updatedLocales = [
          ...questionLocales,
          { ...response.responseObject, language: lang, isValid: false },
        ];
        setQuestionLocales(updatedLocales);
        setAvailableLanguages((prev) => [...prev, lang]);
        setLanguages((prev) => (prev.includes(lang) ? prev : [...prev, lang]));
        setSelectedLocale(lang);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoadingLanguage(null);
    }
  };

  const handleRemoveLocale = (lang: string) => {
    if (lang === question.locales[0]?.language) {
      alert("Cannot delete the original locale.");
      return;
    }
    const updatedLocales = questionLocales.filter(
      (locale) => locale.language !== lang
    );
    setQuestionLocales(updatedLocales);
    setAvailableLanguages(updatedLocales.map((locale) => locale.language));

    if (selectedLocale === lang) {
      setSelectedLocale(question.locales[0]?.language || "en");
    }
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      const response = await updateQuestion({
        ...question,
        id: question.id || question._id || "",
        locales: questionLocales,
      }).unwrap();

      if (response) {
        console.log("Question updated:", response);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Failed to save question:", error);
      setSaveStatus("idle");
    }
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-md mb-4">
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2">
          Question {index + 1}:{" "}
          {
            questionLocales.find((locale) => locale.language === selectedLocale)
              ?.question
          }{" "}
          (
          {
            questionLocales.find((locale) => locale.language === selectedLocale)
              ?.question.length
          }{" "}
          symbols)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <span className="font-bold">
            A){" "}
            {
              questionLocales.find(
                (locale) => locale.language === selectedLocale
              )?.correct
            }{" "}
            (
            {
              questionLocales.find(
                (locale) => locale.language === selectedLocale
              )?.correct.length
            }{" "}
            symbols)
          </span>
          {questionLocales
            .find((locale) => locale.language === selectedLocale)
            ?.wrong.map((option, idx) => (
              <span key={idx} className="font-bold">
                {String.fromCharCode(66 + idx)}) {option} ({option.length}{" "}
                symbols)
              </span>
            ))}
        </div>
      </div>

      {/* Save button with status */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSave}
          className="px-4 py-3 text-lg bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-3"
        >
          <span>Save</span>
          {saveStatus === "saving" ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : saveStatus === "saved" ? (
            <span className="text-green-300">✅</span>
          ) : (
            <img
              src="/save-item-1411-svgrepo-com.svg"
              alt="Save"
              className="w-4 h-4 me-4"
            />
          )}
        </button>

        <button
          onClick={() =>
            navigate(`/edit-question/${question.id || question._id}`)
          }
          className="px-4 py-3 text-lg bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-3"
        >
          Edit
          <img
            src="/edit-button-svgrepo-com.svg"
            alt="Edit"
            className="w-4 h-4 me-4"
          />
        </button>
      </div>

      {/* Language selector with close button in top-right */}
      <div className="flex flex-wrap gap-2 mt-2 ms-5">
        {languages.map((lang) => (
          <div key={lang} className="relative">
            <button
              onClick={() => handleLocaleChange(lang)}
              disabled={loadingLanguage === lang}
              className={`relative px-3 py-1 border rounded flex items-center hover:bg-gray-200 ${
                selectedLocale === lang
                  ? "bg-blue-500 text-white"
                  : availableLanguages.includes(lang)
                  ? "bg-gray-400 text-black"
                  : "bg-white text-black"
              }`}
            >
              {loadingLanguage === lang ? "..." : lang.toUpperCase()}
            </button>

            {/* Кнопка удаления (❌) в правом верхнем углу (теперь белая) */}
            {availableLanguages.includes(lang) &&
              lang !== question.locales[0]?.language && (
                <button
                  onClick={() => handleRemoveLocale(lang)}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-700"
                >
                  ✖
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslatedQuestionItem;
