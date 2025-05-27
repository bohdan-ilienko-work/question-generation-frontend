import BaseQuestionsList from "./BaseQuestionsList";
import { useGetQuestionsHistoryQuery } from "../../state";
import { FC } from "react";

interface Props {
    categoryId: number;
    onMoveQuestions: (selectedIds: string[]) => void;
}

const QuestionsListHistoryInCategory: FC<Props> = (props) => {
    return (
        <BaseQuestionsList
            fetchHook={useGetQuestionsHistoryQuery}
            fetchArgs={{ category: props.categoryId }}
            title={`Questions history in category #${props.categoryId}`}
            onMoveQuestions={props.onMoveQuestions}
        />
    );
};

export default QuestionsListHistoryInCategory;
