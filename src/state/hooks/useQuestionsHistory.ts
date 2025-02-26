import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetQuestionsHistoryQuery } from "../api/questionsApi";

export const useQuestionsHistory = () => {
  const limit = useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters.limit
  );
  const page = useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters.page
  );

  return useGetQuestionsHistoryQuery({ limit, page });
};
