// ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) =>
  error ? (
    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
      {error}
    </div>
  ) : null;

export default ErrorMessage;
