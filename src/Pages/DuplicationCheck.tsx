import { useEffect, useState, useMemo } from "react";
import {
    useGetCategoriesWithQuestionsCountQuery,
    useCheckDuplicatedQuestionsMutation,
    useRejectGeneratedQuestionMutation,
    useRejectGeneratedQuestionsMutation
} from "../state";
import { Input, Tree, Button, Spin, Typography, Divider, message } from "antd";
import type { DataNode } from "antd/es/tree";
import { Question } from "../types";

const { Title, Text } = Typography;
const { Search } = Input;

const QuestionCard = ({ question, onKeep }: { question: Question, onKeep?: () => void }) => (
    <div
        key={question._id}
        style={{
            padding: 16,
            marginBottom: 8,
            backgroundColor: onKeep ? '#fff1f0' : 'white',
            border: onKeep ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
            borderRadius: 8
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                <Text style={{ display: 'block', marginBottom: 8 }}>
                    {question.locales.find(locale => locale.language === 'en')?.question || question.locales[0]?.question}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    ID: {question._id}
                </Text>
            </div>
            {onKeep && (
                <Button
                    type="primary"
                    size="small"
                    onClick={onKeep}
                    style={{ marginLeft: 16 }}
                >
                    Keep
                </Button>
            )}
        </div>
    </div>
);

const buildTreeData = (
    categories: any[],
    searchText: string
): DataNode[] => {
    const map = new Map<number, DataNode & { raw: any }>();
    const tree: (DataNode & { raw: any })[] = [];

    for (const cat of categories) {
        if (!cat.name.toLowerCase().includes(searchText.toLowerCase())) {
            continue;
        }

        const title = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{cat.name}</Text>
                <Text type="secondary">({cat.questionsCount} questions)</Text>
            </div>
        );

        const node: DataNode & { raw: any } = {
            key: cat._id.toString(),
            title,
            children: [],
            raw: cat,
        };

        map.set(cat._id, node);
    }

    for (const cat of categories) {
        const node = map.get(cat._id);
        if (node && cat.parentId != null && map.has(cat.parentId)) {
            map.get(cat.parentId)!.children!.push(node);
        } else if (node) {
            tree.push(node);
        }
    }

    return tree;
};

export default function DuplicationCheck() {
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [searchText, setSearchText] = useState('');
    const { data: categoriesList, isLoading: isCategoriesLoading } = useGetCategoriesWithQuestionsCountQuery();
    const [checkDuplicates, { data: duplicatesData, isLoading: isCheckingDuplicates }] = useCheckDuplicatedQuestionsMutation();

    const [rejectQuestion] = useRejectGeneratedQuestionMutation();
    const [rejectQuestions] = useRejectGeneratedQuestionsMutation();
    const [duplicateGroups, setDuplicateGroups] = useState<string[][]>([]);
    const [keptQuestions, setKeptQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (duplicatesData) {
            setDuplicateGroups(duplicatesData.responseObject.duplicates);
            setKeptQuestions([]); // reset kept questions on new fetch
        }
    }, [duplicatesData]);

    const handleCheckDuplicates = async () => {
        if (selectedCategory) {
            await checkDuplicates({ categoryId: selectedCategory });
        }
    };

    const getQuestionById = (id: string): Question | undefined => {
        return duplicatesData?.responseObject.questions.find(q => q._id === id);
    };

    const handleKeepQuestion = async (selectedId: string, groupIds: string[]) => {
        try {
            const otherIds = groupIds.filter(id => id !== selectedId);
            await Promise.all(otherIds.map(id => rejectQuestion(id)));
            message.success('Other questions in the group have been removed');

            const kept = getQuestionById(selectedId);
            if (kept) {
                setKeptQuestions(prev => [...prev, kept]);
            }

            setDuplicateGroups(prevGroups =>
                prevGroups.filter(group => !group.includes(selectedId))
            );
        } catch (error) {
            message.error('Failed to remove duplicate questions');
            console.error(error);
        }
    };

    const handleKeepFirstFromAllGroups = async () => {
        try {
            const firstIds = duplicatesData?.responseObject.duplicates.map(group => group[0]) || [];
            const otherIds = duplicatesData?.responseObject.duplicates.flat().filter(id => !firstIds.includes(id)) || [];
            await rejectQuestions(otherIds);
            message.success('All duplicate questions have been removed');

            const firstQuestions = firstIds.map(id => getQuestionById(id)).filter(Boolean) as Question[];
            setKeptQuestions(firstQuestions);
            setDuplicateGroups([]);
        }
        catch (error) {
            message.error('Failed to remove duplicate questions');
            console.error(error);
        }
    }

    const renderUniqueQuestions = () => {
        const duplicateIds = new Set(duplicatesData?.responseObject.duplicates.flat() || []);
        const baseUnique = duplicatesData?.responseObject.questions.filter(q => !duplicateIds.has(q._id)) || [];

        const uniqueQuestions = [...baseUnique, ...keptQuestions];

        return (
            <>
                <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    Unique Questions ({uniqueQuestions.length})
                </Title>
                {uniqueQuestions.map(question => (
                    <QuestionCard key={question._id} question={question} />
                ))}
            </>
        );
    };

    const treeData = useMemo(() => {
        return buildTreeData(
            categoriesList?.responseObject.categories || [],
            searchText
        );
    }, [categoriesList, searchText]);

    if (isCategoriesLoading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: 24, display: 'flex', gap: 24, height: 'calc(100vh - 48px)' }}>
            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Title level={4} style={{ marginBottom: 16 }}>Categories</Title>
                <Search
                    placeholder="Search categories"
                    onChange={e => setSearchText(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'white', padding: '16px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                    <Tree
                        treeData={treeData}
                        onSelect={(_, info) => {
                            const node = info.node as unknown as DataNode & { raw: any };
                            setSelectedCategory(node.raw._id);
                        }}
                        selectedKeys={selectedCategory ? [selectedCategory.toString()] : []}
                        showLine={{ showLeafIcon: false }}
                    />
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <Title level={2} style={{ marginBottom: 24 }}>Duplication Check</Title>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <Button
                        type="primary"
                        onClick={handleCheckDuplicates}
                        disabled={!selectedCategory}
                        loading={isCheckingDuplicates}
                    >
                        Find Duplicates
                    </Button>
                    {duplicatesData && (
                        <Button
                            type="primary"
                            onClick={handleKeepFirstFromAllGroups}
                            disabled={!duplicatesData.responseObject.duplicates.length}
                            loading={isCheckingDuplicates}
                        >
                            Keep First From All Groups
                        </Button>
                    )}
                </div>

                {duplicatesData && (
                    <div>
                        {duplicateGroups.length === 0 &&
                            <Text strong style={{ marginBottom: 8, display: 'block' }}>
                                No duplicate groups found
                            </Text>
                        }
                        {duplicateGroups.length > 0 &&
                            <Text strong style={{ marginBottom: 8, display: 'block' }}>
                                Duplicate Groups ({duplicateGroups.length})
                            </Text>
                        }
                        {duplicateGroups.map((group, index) => (
                            <div key={index} style={{ marginBottom: 24 }}>
                                <Text strong style={{ marginBottom: 8, display: 'block' }}>
                                    Group {index + 1} ({group.length} questions)
                                </Text>
                                {group.map(id => {
                                    const question = getQuestionById(id);
                                    return question ? (
                                        <QuestionCard
                                            key={question._id}
                                            question={question}
                                            onKeep={() => handleKeepQuestion(question._id, group)}
                                        />
                                    ) : null;
                                })}
                                <Divider style={{ margin: '16px 0' }} />
                            </div>
                        ))}
                        {renderUniqueQuestions()}
                    </div>
                )}
            </div>
        </div>
    );
}
