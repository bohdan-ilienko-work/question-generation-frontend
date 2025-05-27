import BaseQuestionsList from "./BaseQuestionsList";
import { useGetGeneratedQuestionsQuery } from "../../state";
import { FC } from "react";

interface Props {
    categoryId: number;
    onMoveQuestions: (selectedIds: string[]) => void;
}

const GeneratedQuestionsListInCategory: FC<Props> = (props) => {
    return (
        <BaseQuestionsList
            fetchHook={useGetGeneratedQuestionsQuery}
            fetchArgs={{ category: props.categoryId }}
            title={`Questions list in category #${props.categoryId}`}
            onMoveQuestions={props.onMoveQuestions}
        />
    );
};

export default GeneratedQuestionsListInCategory;
