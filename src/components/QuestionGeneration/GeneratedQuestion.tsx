import { Edit2 } from "lucide-react";
import {
  useConfirmQuestionMutation,
  useRejectQuestionMutation,
} from "../../state/api/questionsApi";
import { useNavigate } from "react-router-dom";
import { Question } from "../../types/Question.interface";

interface GeneratedQuestionProps {
  question: Question;
  editPath: string; // Путь для редактирования
}

export const GeneratedQuestion = ({
  question,
  editPath,
}: GeneratedQuestionProps) => {
  const answers = [
    question.locales[0].correct,
    ...(question.locales[0].wrong || []),
  ];
  const { difficulty, status, type } = question;
  const questionId = editPath === "/edit-question" ? question._id : question.id;

  const [confirmQuestion] = useConfirmQuestionMutation();
  const [rejectQuestion] = useRejectQuestionMutation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`${editPath}/${questionId}`);
  };

  // console.log(question);

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-2">
      <div className="flex-1">
        <h4 className="text-md font-semibold">
          #{questionId}: {question.locales[0].question}
        </h4>

        {/* 🔹 Добавленный блок информации */}
        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-700">
          <span className="px-2 py-1 bg-gray-200 rounded-md">
            <strong>Difficulty:</strong> {difficulty}
          </span>
          <span className="px-2 py-1 bg-gray-200 rounded-md">
            <strong>Status:</strong> {status}
          </span>
          <span className="px-2 py-1 bg-gray-200 rounded-md">
            <strong>Type:</strong> {type.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          {answers.map((answer, index) => (
            <span
              key={index}
              className={`flex items-center ${
                answer === question.locales[0].correct
                  ? "font-bold text-green-600"
                  : ""
              }`}
            >
              <span
                className={`w-4 h-4 flex items-center justify-center border-2 rounded-full mr-2 ${
                  answer === question.locales[0].correct
                    ? "border-green-600 text-green-600"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                {answer === question.locales[0].correct ? "✓" : "✗"}
              </span>
              {String.fromCharCode(65 + index)}. {answer}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="bg-orange-500 text-white px-3 py-1 rounded-md"
          onClick={() => confirmQuestion(questionId!)}
        >
          Accept
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => rejectQuestion(questionId!)}
        >
          Reject
        </button>
        <Edit2
          size={25}
          className="text-gray-600 cursor-pointer hover:text-black"
          onClick={handleEdit}
        />
      </div>
    </div>
  );
};
