import React from "react";
import { GeneratedQuestion } from "./GeneratedQuestion";
import { Question } from "../../types/Question.interface";
import { NavLink } from "react-router-dom";

export interface GeneratedQuestionListProps {
  questions: Question[];
  editPath: string;
}

const GeneratedQuestionList: React.FC<GeneratedQuestionListProps> = ({
  questions,
  editPath,
}) => {
  return questions?.length > 0 ? (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
      <div className="bg-white p-4 rounded-md shadow-md">
        {questions.map((q) => (
          <GeneratedQuestion editPath={editPath} key={q.id} question={q} />
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
