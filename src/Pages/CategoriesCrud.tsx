import { useState } from "react";
import {
  Tree,
  Select,
  Button,
  Card,
  Descriptions,
  Typography,
  Divider,
  Space,
  Input,
  Tabs,
  Modal,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import { Category } from "../types";
import {
  useGetCategoriesQuery,
  useUpdateGeneratedQuestionsCategoryMutation,
  useUpdateQuestionsCategoryMutation
} from "../state";
import { useNavigate } from "react-router-dom";
import GeneratedQuestionsListInCategory from "../components/CategoriesCrud/GeneratedQuestionsListInCategory";
import QuestionsListHistoryInCategory from "../components/CategoriesCrud/QuestionsListHistoryInCategory";

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ActionButton = ({
  icon,
  color,
  onClick,
  title,
}: {
  icon: string;
  color: string;
  onClick: () => void;
  title: string;
}) => (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    size="small"
    shape="circle"
    style={{ backgroundColor: color, color: "white", marginLeft: 8 }}
    title={title}
  >
    {icon}
  </Button>
);

const buildTreeData = (
  categories: Category[],
  language: string,
  handleAddSubcategory: (parentId: number) => void,
  handleDeleteCategory: (categoryId: number) => void,
  handleEditCategory: (categoryId: number) => void
): DataNode[] => {
  const map = new Map<number, DataNode & { raw: Category }>();
  const tree: (DataNode & { raw: Category })[] = [];

  for (const cat of categories) {
    const titleText =
      cat.locales.find((l) => l.language === language)?.value || cat.name;

    const title = (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{titleText}</span>
        <span>
          <ActionButton
            icon="+"
            color="#52c41a"
            onClick={() => handleAddSubcategory(cat._id)}
            title="Add subcategory"
          />
          <ActionButton
            icon="-"
            color="#ff4d4f"
            onClick={() => handleDeleteCategory(cat._id)}
            title="Delete category"
          />
          <ActionButton
            icon="✎"
            color="#1890ff"
            onClick={() => handleEditCategory(cat._id)}
            title="Edit category"
          />
        </span>
      </div>
    );

    const node: DataNode & { raw: Category } = {
      key: cat._id.toString(),
      title,
      children: [],
      raw: cat,
    };

    map.set(cat._id, node);
  }

  for (const cat of categories) {
    const node = map.get(cat._id)!;
    if (cat.parentId != null && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children!.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
};

export default function CategoriesCrud() {
  const navigate = useNavigate();
  const { data: categoriesList } = useGetCategoriesQuery({ page: 1, limit: 1500 });
  const [language, setLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateGeneratedQuestionsCategory] = useUpdateGeneratedQuestionsCategoryMutation();
  const [updateQuestionsCategory] = useUpdateQuestionsCategoryMutation();
  const [updateQuestionsType, setUpdateQuestionsType] = useState<"generated" | "history" | null>(null);

  const availableCategories =
    categoriesList?.responseObject.categories.filter(
      (cat: Category) => cat._id !== selectedCategory?._id
    ) || [];

  const handleAddSubcategory = (parentId: number) => {
    navigate(`/categories-crud/create/${parentId}`);
  };
  const handleDeleteCategory = (categoryId: number) => {
    navigate(`/categories-crud/delete/${categoryId}`);
  };
  const handleEditCategory = (categoryId: number) => {
    navigate(`/categories-crud/edit/${categoryId}`);
  };

  const treeData = buildTreeData(
    categoriesList?.responseObject.categories || [],
    language,
    handleAddSubcategory,
    handleDeleteCategory,
    handleEditCategory
  );

  const onSelect: (
    selectedKeys: React.Key[],
    info: { node: DataNode & { raw: Category } }
  ) => void = (_selectedKeys, info) => {
    const node = info.node as DataNode & { raw: Category };
    setSelectedCategory(node.raw);
  };

  // Открыть модальное окно выбора категории
  const handleMoveQuestionsClick = (questionIds: string[]) => {
    setSelectedQuestionIds(questionIds);
    setMoveModalVisible(true);
    setTargetCategoryId(null);
  };

  const handleConfirmMove = () => {
    try {
      if (!targetCategoryId) return;
      if (updateQuestionsType === "generated") {
        updateGeneratedQuestionsCategory({
          questionIds: selectedQuestionIds,
          categoryId: targetCategoryId!,
        });
      } else if (updateQuestionsType === "history") {
        updateQuestionsCategory({
          questionIds: selectedQuestionIds,
          categoryId: targetCategoryId!,
        });
      }
      messageApi.success(
        `Questions (${selectedQuestionIds.length}) will be moved to category ${targetCategoryId}`
      );
      console.log("Move questions:", selectedQuestionIds, "to category:", targetCategoryId);
      setMoveModalVisible(false);
      setSelectedQuestionIds([]);

    } catch (error) {
      console.error("Error moving questions:", error);
      messageApi.error("An error occurred while moving questions.");
    }
  };

  if (!categoriesList) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          gap: 24,
          padding: 24,
          height: "94vh",
          boxSizing: "border-box",
        }}
      >
        <Card
          title="Categories"
          style={{
            width: 350,
            flexShrink: 0,
            height: "100%",
            display: "flex",
            overflowY: "auto",
            flexDirection: "column",
          }}
          bodyStyle={{
            padding: 16,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>Language:</Text>
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: "100%", marginTop: 4 }}
            >
              <Option value="ua">Ukrainian</Option>
              <Option value="es">Spanish</Option>
              <Option value="en">English</Option>
              <Option value="ru">Russian</Option>
              <Option value="fr">French</Option>
              <Option value="de">German</Option>
              <Option value="it">Italian</Option>
              <Option value="pl">Polish</Option>
              <Option value="tr">Turkish</Option>
            </Select>
          </div>
          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <Tree
              treeData={treeData}
              onSelect={(selectedKeys, info) => {
                const node = info.node as unknown as DataNode & { raw: Category };
                onSelect(selectedKeys, { node });
              }}
              showLine={{ showLeafIcon: false }}
            />
          </div>
        </Card>

        <Card
          title={
            selectedCategory ? (
              <>
                <Title level={5} style={{ margin: 0 }}>
                  Selected Category: <Text code>{selectedCategory.name}</Text>
                </Title>
              </>
            ) : (
              "No category selected"
            )
          }
          style={{ flex: 1, overflowY: "auto", height: "100%" }}
        >
          {selectedCategory ? (
            <Tabs defaultActiveKey="1" style={{ height: "100%" }}>
              <TabPane tab="Details" key="1">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="ID">
                    {selectedCategory._id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Default name">
                    {selectedCategory.name}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>Locales</Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedCategory.locales.map((loc) => (
                    <div key={loc.language} style={{ display: "flex", gap: 12 }}>
                      <Text style={{ width: 80 }} strong>
                        {loc.language.toUpperCase()}:
                      </Text>
                      <Input
                        value={loc.value}
                        readOnly
                        placeholder="No value"
                        style={{ flex: 1 }}
                      />
                    </div>
                  ))}
                </Space>

                <Divider />

                <div style={{ textAlign: "right" }}>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() =>
                        navigate(`/categories-crud/edit/${selectedCategory._id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      type="primary"
                      onClick={() =>
                        navigate(`/categories-crud/delete/${selectedCategory._id}`)
                      }
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              </TabPane>

              <TabPane tab="Questions (Generated)" key="2">
                <GeneratedQuestionsListInCategory
                  categoryId={selectedCategory._id}
                  onMoveQuestions={(questionIds) => {
                    handleMoveQuestionsClick(questionIds)
                    setUpdateQuestionsType("generated");
                  }}
                />
              </TabPane>
              <TabPane tab="Questions (History)" key="3">
                <QuestionsListHistoryInCategory
                  categoryId={selectedCategory._id}
                  onMoveQuestions={(questionIds) => {
                    handleMoveQuestionsClick(questionIds)
                    setUpdateQuestionsType("history");
                  }}
                />
              </TabPane>
            </Tabs>
          ) : (
            <Text type="secondary">
              Please select a category from the tree to view details.
            </Text>
          )}

          {/* Модалка для выбора новой категории */}
          <Modal
            title="Move questions to category"
            open={moveModalVisible}
            onOk={handleConfirmMove}
            onCancel={() => setMoveModalVisible(false)}
            okButtonProps={{ disabled: !targetCategoryId }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text>Select a target category:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Select category"
                value={targetCategoryId ?? undefined}
                onChange={setTargetCategoryId}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children?.toString() ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {availableCategories.map((cat: Category) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.locales.find((l) => l.language === language)?.value ||
                      cat.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Text type="secondary">
                {selectedQuestionIds.length} questions will be moved.
              </Text>
            </div>
          </Modal>
        </Card>
      </div>
    </>
  );
}
