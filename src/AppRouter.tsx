import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import DashboardWrapper from "./components/DashboardWrapper";
import { lazy, Suspense } from "react";

// Динамическая загрузка страниц
const Login = lazy(() => import("./Pages/Login"));
const QuestionGeneration = lazy(() => import("./Pages/QuestionGeneration"));
const GeneratedQuestions = lazy(() => import("./Pages/GeneratedQuestions"));
const QuestionsHistory = lazy(() => import("./Pages/QuestionsHistory"));
const EditQuestion = lazy(() => import("./Pages/EditQuestion")); // Страница редактирования
const Settings = lazy(() => import("./Pages/Settings"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<p>Loading...</p>}>
        <Login />
      </Suspense>
    ),
  },

  {
    path: "/",
    element: (
      <RequireAuth>
        <DashboardWrapper />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="generate-question" replace /> },
      {
        path: "generate-question",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <QuestionGeneration />
          </Suspense>
        ),
      },
      {
        path: "generated-questions",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <GeneratedQuestions />
          </Suspense>
        ),
      },
      {
        path: "questions-history",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <QuestionsHistory />
          </Suspense>
        ),
      },
      {
        path: "edit-question/:id",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EditQuestion />
          </Suspense>
        ),
      }, // Страница редактирования
      {
        path: "settings",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },

  { path: "*", element: <Navigate to="/generate-question" replace /> },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
