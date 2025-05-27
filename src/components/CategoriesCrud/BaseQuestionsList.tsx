import { Checkbox, List, Typography, Pagination, Card, Space, Button } from "antd";
import Loader from "../Loader";
import { Question } from "../../types";
import { useState } from "react";

const { Text, Title } = Typography;

// Аргументы для фетча (минимально общие)
export interface BaseQuestionsListFetchArgs {
    page: number;
    limit: number;
    [key: string]: unknown;
}

export interface BaseQuestionsListData {
    responseObject: {
        questions: Question[];
        totalPages?: number;
        questionsCount?: number;
    };
}

export interface FetchHookResult<FetchData> {
    data?: FetchData;
    isLoading: boolean;
    error?: unknown;
}

interface BaseQuestionsListProps<
    FetchArgs extends BaseQuestionsListFetchArgs,
    FetchData extends BaseQuestionsListData
> {
    fetchHook: (args: FetchArgs) => FetchHookResult<FetchData>;
    fetchArgs: Omit<FetchArgs, "page" | "limit">;
    title: string;
    onMoveQuestions: (selectedIds: string[]) => void;
}

function BaseQuestionsList<
    FetchArgs extends BaseQuestionsListFetchArgs = BaseQuestionsListFetchArgs,
    FetchData extends BaseQuestionsListData = BaseQuestionsListData
>({
    fetchHook,
    fetchArgs,
    title,
    onMoveQuestions,
}: BaseQuestionsListProps<FetchArgs, FetchData>) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    // Собираем аргументы для хука
    const { data: questionsList, isLoading, error } = fetchHook({
        ...fetchArgs,
        page,
        limit,
    } as FetchArgs);

    const questions = questionsList?.responseObject.questions || [];

    const handleSelect = (questionId: string, checked: boolean) => {
        setSelectedQuestionIds((prev) =>
            checked ? [...prev, questionId] : prev.filter((id) => id !== questionId)
        );
    };

    const handleMove = () => {
        onMoveQuestions(selectedQuestionIds);
        setSelectedQuestionIds([]);
    };

    // Select all on current page
    const handleSelectAll = () => {
        const currentPageIds = questions.map((q) => q._id);
        setSelectedQuestionIds((prev) => [
            ...prev,
            ...currentPageIds.filter((id) => !prev.includes(id)),
        ]);
    };

    // Deselect all (all pages)
    const handleDeselectAll = () => {
        setSelectedQuestionIds([]);
    };

    if (isLoading) return <Loader />;
    if (error) {
        let errorMessage: string;
        if (typeof error === "object" && error !== null && "data" in error) {
            errorMessage = (error as { data?: { message?: string } }).data?.message || "An error occurred";
        } else if (typeof error === "string") {
            errorMessage = error;
        } else {
            errorMessage = "An error occurred";
        }
        return (
            <p>
                Error: {errorMessage}
            </p>
        );
    }

    const allCurrentPageSelected = questions.length > 0 && questions.every((q) => selectedQuestionIds.includes(q._id));

    return (
        <Card
            title={
                <Title level={5} style={{ margin: 0 }}>
                    {title} (count: {questionsList?.responseObject.questionsCount})
                </Title>
            }
            extra={
                <Space>
                    <Button
                        onClick={handleSelectAll}
                        disabled={allCurrentPageSelected || questions.length === 0}
                    >
                        Select all
                    </Button>
                    {selectedQuestionIds.length > 0 && (
                        <Button onClick={handleDeselectAll} danger>
                            Deselect all
                        </Button>
                    )}
                    {selectedQuestionIds.length > 0 && (
                        <Button type="primary" onClick={handleMove}>
                            Move questions
                        </Button>
                    )}
                </Space>
            }
            style={{ height: "100%", overflowY: "auto" }}
        >
            <List
                dataSource={questions}
                renderItem={(question: Question) => {
                    const id = question._id;
                    const label =
                        question.locales[0]?.question || "(no translation available)";
                    const checked = selectedQuestionIds.includes(id);

                    return (
                        <List.Item style={{ padding: "8px 0" }}>
                            <Checkbox
                                checked={checked}
                                onChange={(e) => handleSelect(id, e.target.checked)}
                            >
                                <Text>{label}</Text>
                            </Checkbox>
                        </List.Item>
                    );
                }}
            />

            <Space style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={questionsList?.responseObject.questionsCount}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50", "100"]}
                    onChange={(newPage, newLimit) => {
                        setPage(newPage);
                        setLimit(newLimit);
                    }}
                />
            </Space>
        </Card>
    );
}

export default BaseQuestionsList;
