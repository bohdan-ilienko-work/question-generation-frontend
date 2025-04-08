import { useState } from "react";
import { Tree, TreeProps, Select, Button } from "antd";
import type { DataNode } from "antd/es/tree";
import { Category } from "../types";
import { useGetCategoriesQuery } from "../state";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

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

  categories.forEach((cat) => {
    const titleText =
      cat.locales.find((l) => l.language === language)?.value || cat.name;

    const title = (
      <div className="flex justify-between items-center">
        <span>{titleText}</span>
        <div className="ml-2 flex items-center">
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
        </div>
      </div>
    );

    map.set(cat._id, {
      key: cat._id.toString(),
      title,
      children: [],
      raw: cat,
    });
  });

  categories.forEach((cat) => {
    const node = map.get(cat._id)!;
    if (cat.parentId && map.has(Number(cat.parentId))) {
      const parent = map.get(Number(cat.parentId))!;
      parent.children!.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};

export default function CategoriesCrud() {
  const navigate = useNavigate();
  const { data } = useGetCategoriesQuery({ page: 1, limit: 1500 });
  const [language, setLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleAddSubcategory = (parentId: number) => {
    navigate(`/categories-crud/create/${parentId}`);
  };
  const handleDeleteCategory = async (categoryId: number) => {
    navigate(`/categories-crud/delete/${categoryId}`);
  };
  const handleEditCategory = (categoryId: number) => {
    navigate(`/categories-crud/edit/${categoryId}`);
  };

  const treeData = buildTreeData(
    data?.responseObject.categories || [],
    language,
    handleAddSubcategory,
    handleDeleteCategory,
    handleEditCategory
  );

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const node = info.node as unknown as DataNode & { raw: Category };
    setSelectedCategory(node.raw);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md w-full flex p-4 gap-4 h-full h-full">
      <div className="border-r pr-4 w-1/3 overflow-y-auto">
        <h2 className="font-bold mb-2">Categories</h2>
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium mb-1">
            Language:
          </label>
          <Select
            id="language"
            value={language}
            onChange={setLanguage}
            className="w-full"
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
        <Tree
          treeData={treeData}
          onSelect={onSelect}
          showLine={{ showLeafIcon: false }}
        />
      </div>

      <div className="flex-grow max-w-2xl flex flex-col gap-4">
        <h3 className="font-bold">Selected Category:</h3>
        {selectedCategory ? (
          <div className="space-y-3">
            <div className="text-gray-700">
              <strong>ID:</strong> {selectedCategory._id}
            </div>
            <div className="text-gray-700">
              <strong>Default name:</strong> {selectedCategory.name}
            </div>
            <h4 className="font-semibold mt-2">Locales:</h4>
            <>
              {selectedCategory.locales.map((loc) => (
                <div key={loc.language} className="flex gap-2 items-center">
                  <label className="w-[100px] text-sm font-medium">
                    {loc.language.toUpperCase()}:
                  </label>
                  <span className="w-full block px-2 py-1 border rounded bg-gray-50">
                    {loc.value || (
                      <span className="text-gray-400 italic">No value</span>
                    )}
                  </span>
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
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
              </div>
            </>
          </div>
        ) : (
          <span>No category selected. Please select one.</span>
        )}
      </div>
    </div>
  );
}
