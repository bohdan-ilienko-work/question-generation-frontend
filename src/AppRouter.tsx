import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { Login } from "./Pages/Login";
import QuestionGeneration from "./Pages/QuestionGeneration";
import DashboardWrapper from "./components/DashboardWrapper";
import GeneratedQuestions from "./Pages/GeneratedQuestions";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <RequireAuth>
              <DashboardWrapper />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="generate-question" replace />} />
          <Route path="generate-question" element={<QuestionGeneration />} />
          <Route path="generated-questions" element={<GeneratedQuestions />} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/generate-question" replace />}
        />
      </Routes>
    </Router>
  );
};
