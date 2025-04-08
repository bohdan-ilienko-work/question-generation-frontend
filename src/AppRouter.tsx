import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import DashboardWrapper from "./components/DashboardWrapper";
import { lazy, Suspense } from "react";
import CategoriesCrud from "./Pages/CategoriesCrud";
import CreateCategory from "./Pages/CreateCategory";
import DeleteCategory from "./Pages/DeleteCategory";
import EditCategory from "./Pages/EditCategory";

// Динамическая загрузка страницw
const Login = lazy(() => import("./Pages/Login"));
const QuestionGeneration = lazy(() => import("./Pages/QuestionGeneration"));
const GeneratedQuestions = lazy(() => import("./Pages/GeneratedQuestions"));
const QuestionsHistory = lazy(() => import("./Pages/QuestionsHistory"));
const EditQuestion = lazy(() => import("./Pages/EditQuestion")); // Страница редактирования
const Settings = lazy(() => import("./Pages/Settings"));
const EditGeneratedQuestion = lazy(
  () => import("./Pages/EditGeneratedQuestion")
);
const DeeplLogs = lazy(() => import("./Pages/DeeplLogs"));
const ParseQuestions = lazy(() => import("./Pages/ParseQuestions"));
const TranslatedQuestions = lazy(() => import("./Pages/TranslatedQuestions"));

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
      { index: true, element: <Navigate to="parse-questions" replace /> },
      {
        path: "parse-questions",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <ParseQuestions />
          </Suspense>
        ),
      },
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
        path: "edit-generated-question/:id",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EditGeneratedQuestion />
          </Suspense>
        ),
      },
      {
        path: "translated-questions",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <TranslatedQuestions />
          </Suspense>
        ),
      },
      {
        path: "deepl-logs",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <DeeplLogs />
          </Suspense>
        ),
      },
      {
        path: "categories-crud",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <CategoriesCrud />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/create/:parentId",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <CreateCategory />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/edit/:categoryId",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EditCategory />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/delete/:categoryId",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <DeleteCategory />
          </Suspense>
        ),
      },
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
