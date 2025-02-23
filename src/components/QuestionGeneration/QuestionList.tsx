import { GeneratedQuestion } from "./GeneratedQuestion";

const QuestionList = ({
  questions,
}: {
  questions: {
    id: string;
    question: string;
    correct: string;
    wrong: string[];
  }[];
}) => {
  return (
    questions.length > 0 && (
      <div className="mt-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
        <div className="bg-white p-4 rounded-md shadow-md">
          {questions.map((q, index) => (
            <GeneratedQuestion
              key={q.id}
              questionNumber={index + 1}
              questionText={q.question}
              correctAnswer={q.correct}
              wrongAnswers={q.wrong}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default QuestionList;
