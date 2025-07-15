import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

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
const CategoriesCrud = lazy(() => import("./Pages/CategoriesCrud"));
const CreateCategory = lazy(() => import("./Pages/CreateCategory"));
const EditCategory = lazy(() => import("./Pages/EditCategory"));
const DeleteCategory = lazy(() => import("./Pages/DeleteCategory"));
const DashboardWrapper = lazy(() => import("./components/DashboardWrapper"));
const DuplicationCheck = lazy(
  () => import("./Pages/DuplicationCheck")
);
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
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
          <Suspense fallback={<Loader />}>
            <ParseQuestions />
          </Suspense>
        ),
      },
      {
        path: "generate-question",
        element: (
          <Suspense fallback={<Loader />}>
            <QuestionGeneration />
          </Suspense>
        ),
      },
      {
        path: "generated-questions",
        element: (
          <Suspense fallback={<Loader />}>
            <GeneratedQuestions />
          </Suspense>
        ),
      },
      {
        path: "duplication-check",
        element: (
          <Suspense fallback={<Loader />}>
            <DuplicationCheck />
          </Suspense>
        ),
      },
      {
        path: "questions-history",
        element: (
          <Suspense fallback={<Loader />}>
            <QuestionsHistory />
          </Suspense>
        ),
      },
      {
        path: "edit-question/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditQuestion />
          </Suspense>
        ),
      }, // Страница редактирования
      {
        path: "edit-generated-question/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditGeneratedQuestion />
          </Suspense>
        ),
      },
      {
        path: "translated-questions",
        element: (
          <Suspense fallback={<Loader />}>
            <TranslatedQuestions />
          </Suspense>
        ),
      },
      {
        path: "deepl-logs",
        element: (
          <Suspense fallback={<Loader />}>
            <DeeplLogs />
          </Suspense>
        ),
      },
      {
        path: "categories-crud",
        element: (
          <Suspense fallback={<Loader />}>
            <CategoriesCrud />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/create/:parentId",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateCategory />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/edit/:categoryId",
        element: (
          <Suspense fallback={<Loader />}>
            <EditCategory />
          </Suspense>
        ),
      },
      {
        path: "categories-crud/delete/:categoryId",
        element: (
          <Suspense fallback={<Loader />}>
            <DeleteCategory />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loader />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },

  { path: "*", element: <Navigate to="/generate-question" replace /> },
], {
  basename: "/generator",
});

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
