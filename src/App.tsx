import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>
        <img alt="React Logo" className="text-4xl" src={reactLogo} />
        <img alt="Vite Logo" className="text-4xl" src={viteLogo} />

        <button onClick={() => setCount((count) => count + 1)}>
          count is: {count}
        </button>
      </h1>
    </>
  );
}

export default App;
