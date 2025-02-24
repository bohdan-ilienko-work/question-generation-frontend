import { Edit2 } from "lucide-react";
import {
  useConfirmQuestionMutation,
  useRejectQuestionMutation,
} from "../../state/api/questionsApi";

export const GeneratedQuestion = ({
  id,
  questionNumber,
  questionText,
  correctAnswer,
  wrongAnswers,
}: {
  id: string;
  questionNumber: number;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
}) => {
  const answers = [correctAnswer, ...wrongAnswers];

  const [confirmQuestion] = useConfirmQuestionMutation();
  const [rejectQuestion] = useRejectQuestionMutation();

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-2">
      <div className="flex-1">
        <h4 className="text-md font-semibold">
          Question {questionNumber}: {questionText}
        </h4>
        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
          {answers.map((answer, index) => (
            <span
              key={index}
              className={`flex items-center ${
                answer === correctAnswer ? "font-bold text-green-600" : ""
              }`}
            >
              <span
                className={`w-4 h-4 flex items-center justify-center border-2 rounded-full mr-2 ${
                  answer === correctAnswer
                    ? "border-green-600 text-green-600"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                {answer === correctAnswer ? "●" : "○"}
              </span>
              {String.fromCharCode(65 + index)}. {answer}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="bg-orange-500 text-white px-3 py-1 rounded-md"
          onClick={() => confirmQuestion(id)}
        >
          Accept
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => rejectQuestion(id)}
        >
          Reject
        </button>
        <Edit2
          size={25}
          className="text-gray-600 cursor-pointer hover:text-black"
        />
      </div>
    </div>
  );
};
