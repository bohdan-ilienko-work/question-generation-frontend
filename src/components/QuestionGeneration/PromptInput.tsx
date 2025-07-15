import React from "react";
import { Input } from "antd";
import { GenerateQuestionSettings, Action } from "./state/types";

interface PromptInputProps {
  state: GenerateQuestionSettings;
  dispatch: React.Dispatch<Action>;
}

const PromptInput: React.FC<PromptInputProps> = ({ state, dispatch }) => (
  <div style={{ marginTop: 32, width: "100%", maxWidth: 720 }}>
    <Input
      value={state.prompt}
      onChange={e =>
        dispatch({
          type: "SET_VALUE",
          field: "prompt",
          value: e.target.value,
        })
      }
      placeholder="Enter your prompt..."
      size="large"
      allowClear
      style={{
        background: "#fff",
        borderRadius: 8,
        fontSize: 16,
        padding: "10px 14px"
      }}
      maxLength={200}
    />
  </div>
);

export default PromptInput;
