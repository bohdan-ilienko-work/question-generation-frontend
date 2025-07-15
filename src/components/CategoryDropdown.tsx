import React, { useState } from "react";
import {
  Dropdown,
  Input,
  List,
  Button,
  Pagination,
  Popconfirm,
  Space,
  Select,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Category } from "../types";
import { useClearCategoryCacheMutation } from "../state";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category) => void;
  handleTitleChange: (title: string) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  totalPages: number;
  page: number;
  limit: number;
  title?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  handleTitleChange,
  handlePageChange,
  handleLimitChange,
  totalPages,
  page,
  limit,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [clearCache, { isLoading }] = useClearCategoryCacheMutation();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const onClear = async (id: number) => {
    setPendingId(id);
    try {
      await clearCache({ categoryId: id }).unwrap();
    } finally {
      setPendingId(null);
    }
  };

  const dropdownContent = (
    <div style={{
      minWidth: 320,
      maxWidth: 440,
      padding: 8,
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 6,
    }}>
      {/* Поиск */}
      <Input
        placeholder="Search category…"
        allowClear
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      {/* Список */}
      <List
        bordered
        dataSource={categories}
        locale={{ emptyText: "No categories" }}
        style={{ maxHeight: 220, overflowY: "auto" }}
        renderItem={(cat) => (
          <List.Item
            style={{
              fontWeight: cat._id === selectedCategory?._id ? 600 : 400,
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              setSelectedCategory(cat);
              setOpen(false);
            }}
            actions={[
              <Popconfirm
                key="clear"
                title="Clear cache for this category?"
                okText="Yes"
                cancelText="No"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onClear(cat._id);
                }}
                onCancel={(e) => e?.stopPropagation()}
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  icon={
                    pendingId === cat._id && isLoading ? (
                      <LoadingOutlined />
                    ) : (
                      <DeleteOutlined />
                    )
                  }
                >
                  Clear
                </Button>
              </Popconfirm>,
            ]}
          >
            {cat.name}
          </List.Item>
        )}
      />

      <Space
        style={{
          marginTop: 12,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Pagination
          size="small"
          current={page}
          total={totalPages * limit}
          pageSize={limit}
          showSizeChanger={false}
          onChange={(p) => handlePageChange(p)}
        />

        <Select
          size="small"
          value={limit}
          onChange={(val) => handleLimitChange(val)}
          dropdownMatchSelectWidth={false}
          style={{ width: 80 }}
          options={[
            { value: 5, label: "5 / page" },
            { value: 10, label: "10 / page" },
            { value: 20, label: "20 / page" },
            { value: 50, label: "50 / page" },
          ]}
        />
      </Space>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      menu={{ items: [] }}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
    >
      <Button
        style={{
          width: '100%',
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {selectedCategory?.name || "Select category"}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default CategoryDropdown;
