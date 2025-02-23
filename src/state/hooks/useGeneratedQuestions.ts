import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetGeneratedQuestionsQuery } from "../api/questionsApi";

export const useGeneratedQuestions = () => {
  const limit = useSelector((state: RootState) => state.questions.limit);
  const page = useSelector((state: RootState) => state.questions.page);

  return useGetGeneratedQuestionsQuery({ limit, page });
};
