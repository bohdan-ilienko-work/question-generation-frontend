// TokensUsed.tsx
import React from "react";

interface TokensUsedProps {
  tokensUsed: number;
}

const TokensUsed: React.FC<TokensUsedProps> = ({ tokensUsed }) =>
  tokensUsed > 0 ? (
    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
      Total tokens used: {tokensUsed}
    </div>
  ) : null;

export default TokensUsed;
