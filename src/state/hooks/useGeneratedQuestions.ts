import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetGeneratedQuestionsQuery } from "../api/questionsApi";

export const useGeneratedQuestions = () => {
  const limit = useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters.limit
  );
  const page = useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters.page
  );

  return useGetGeneratedQuestionsQuery({ limit, page });
};
