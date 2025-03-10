// QuestionGeneration.tsx
import React, { useReducer } from "react";
import {
  QuestionGenerate,
  useGenerateQuestionMutation,
} from "../state/api/questionsApi";
// import QuestionList from "../components/QuestionGeneration/QuestionList";
import GenerateQuestionsForm from "../components/QuestionGeneration/GenerateQuestionsForm";
import {
  initialState,
  reducer,
} from "../components/QuestionGeneration/state/reducer";
import PromptInput from "../components/QuestionGeneration/PromptInput";
import ErrorMessage from "../components/QuestionGeneration/ErrorMessage";
import TokensUsed from "../components/QuestionGeneration/TokensUsed";
import { NavLink } from "react-router-dom";

const QuestionGeneration: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [generateQuestion, { isLoading }] = useGenerateQuestionMutation();

  const handleGenerate = async () => {
    if (!state.prompt.trim()) {
      dispatch({ type: "SET_ERROR", error: "Prompt cannot be empty" });
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await generateQuestion({
        prompt: state.prompt,
        difficulty: +state.difficulty,
        // max_tokens: state.max_tokens,
        count: state.count,
        category: state.category?._id,
        temperature: state.temperature,
        type: state.type,
        model: state.model,
        requiredLanguages: state.requiredLanguages,
      } as QuestionGenerate).unwrap();

      dispatch({ type: "SET_IS_GENERATED", isGenerated: true });

      dispatch({
        type: "SET_TOKENS_USED",
        tokensUsed: response.responseObject.totalTokensUsed,
      });

      dispatch({ type: "CLEAR_PROMPT" });
      dispatch({ type: "SET_ERROR", error: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to generate questions" });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-3xl">
        <GenerateQuestionsForm state={state} dispatch={dispatch} />
      </div>

      <PromptInput
        state={state}
        dispatch={dispatch}
        // handleGenerate={handleGenerate}
      />
      <button
        onClick={handleGenerate}
        className={`text-white p-2 rounded-md flex items-center gap-2 mt-4 ${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        }`}
        disabled={isLoading}
      >
        Generate
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            ></path>
          </svg>
        ) : null}
      </button>

      <ErrorMessage error={state.error} />
      <TokensUsed tokensUsed={state.tokensUsed} />
      {state.isGenerated && (
        <NavLink
          to="/generated-questions"
          className="bg-orange-500 text-white text-md font-semibold px-6 py-2 rounded-md mt-4"
        >
          View Questions
        </NavLink>
      )}
      {/* <QuestionList questions={state.questions} /> */}
    </div>
  );
};

export default QuestionGeneration;
