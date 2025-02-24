import React from "react";
import { GeneratedQuestion } from "./GeneratedQuestion";
import { Question } from "../../types/Question.interface";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export interface GeneratedQuestionListProps {
  questions: Question[];
}

const GeneratedQuestionList: React.FC<GeneratedQuestionListProps> = ({
  questions,
}) => {
  const page = useSelector((state: RootState) => state.questions.page);
  const limit = useSelector((state: RootState) => state.questions.limit);

  return questions?.length > 0 ? (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
      <div className="bg-white p-4 rounded-md shadow-md">
        {questions.map((q, index) => (
          <GeneratedQuestion
            id={q.id}
            // key={index.toString()}
            questionNumber={index + 1 + (page - 1) * limit}
            questionText={q.locales[0].question}
            correctAnswer={q.locales[0].correct}
            wrongAnswers={q.locales[0].wrong}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center mt-6">
      <h3 className="text-lg font-semibold mb-2">No questions generated yet</h3>
      <NavLink
        to="/generate-question"
        className="bg-blue-500 text-white text-md font-semibold px-6 py-2 rounded-md mt-4"
      >
        Generate Questions
      </NavLink>
    </div>
  );
};

export default GeneratedQuestionList;
