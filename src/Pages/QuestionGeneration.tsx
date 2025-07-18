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
import { Button } from "antd";

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

      <GenerateQuestionsForm state={state} dispatch={dispatch} />

      <div style={{ width: "100%", maxWidth: 720 }}>
        <PromptInput state={state} dispatch={dispatch} />
        <Button
          type="primary"
          size="large"
          style={{ marginTop: 24, minWidth: 140, fontWeight: 600 }}
          onClick={handleGenerate}
          loading={isLoading}
          disabled={isLoading}
          block
        >
          Generate
        </Button>
      </div>


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
