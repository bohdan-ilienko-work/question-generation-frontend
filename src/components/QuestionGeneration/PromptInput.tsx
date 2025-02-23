// PromptInput.tsx
import React from "react";
import { GenerateQuestionSettings, Action } from "./state/types";

interface PromptInputProps {
  state: GenerateQuestionSettings;
  dispatch: React.Dispatch<Action>;
  handleGenerate: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  state,
  dispatch,
  handleGenerate,
}) => (
  <div className="mt-6 w-full max-w-3xl">
    <div className="border border-gray-400 p-4 flex justify-between items-center bg-white rounded-md">
      <input
        type="text"
        value={state.prompt}
        onChange={(e) =>
          dispatch({
            type: "SET_VALUE",
            field: "prompt",
            value: e.target.value,
          })
        }
        placeholder="Enter your prompt..."
        className="w-full p-2 border-none outline-none bg-transparent text-black"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Generate
      </button>
    </div>
  </div>
);

export default PromptInput;
