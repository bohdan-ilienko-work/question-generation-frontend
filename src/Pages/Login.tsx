import { useReducer } from "react";
import { useLoginMutation } from "../state/api/authApi";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../state/authSlice";
import { useDispatch } from "react-redux";

// Определение типов для `useReducer`
type State = {
  username: string;
  password: string;
  error: string | null;
};

type Action =
  | { type: "SET_FIELD"; field: "username" | "password"; value: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

// Начальное состояние
const initialState: State = {
  username: "",
  password: "",
  error: null,
};

// Редюсер для управления состоянием
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMutation] = useLoginMutation();
  const navigate = useNavigate();
  const dispatchAction = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const tokens = await loginMutation({
        username: state.username,
        password: state.password,
      }).unwrap();

      dispatchAction(setTokens(tokens.responseObject));
      navigate("/"); // Redirect to home page
    } catch {
      dispatch({ type: "SET_ERROR", error: "Incorrect Login Data" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className={`bg-white p-8 shadow-md rounded-md flex transition-all duration-300 ${
          state.error ? "w-[700px]" : "w-[400px]"
        }`}
      >
        <div className="flex-1">
          {/* Логотип и название */}
          <div className="flex items-center">
            <img
              src="/brain-icon.png"
              alt="QuizMaster Logo"
              className="w-8 h-8 mr-2"
            />
            <h1 className="text-xl font-bold text-gray-700">QuizMaster</h1>
          </div>
          <h2 className="text-xl font-semibold mt-2">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue exploring the world of quizzes.
          </p>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              placeholder="Login"
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={state.username}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "username",
                  value: e.target.value,
                })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={state.password}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "password",
                  value: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md font-semibold transition"
            >
              Login
            </button>
          </form>

          <div className="mt-3 text-sm text-blue-500 hover:underline text-center cursor-pointer">
            Forgot your password?
          </div>
        </div>

        {/* Блок ошибки с красной линией */}
        {state.error && (
          <div className="flex-1 ml-4 flex items-center">
            <div className="border-l-4 border-red-500 pl-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              <strong className="block">{state.error}</strong>
              <p className="text-sm">
                Please check your email and password and try again. If you
                continue to experience issues, consider resetting your password
                or contact support for assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
