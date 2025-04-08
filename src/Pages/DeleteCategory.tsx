import { useNavigate, useParams } from "react-router-dom";
import { useDeleteCategoryMutation } from "../state";
import { Card, Typography, Button, Space, message } from "antd";

const { Title, Text } = Typography;

export default function DeleteCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      await deleteCategory({ categoryId: categoryId! }).unwrap();
      message.success("Category deleted successfully");
      navigate("/categories-crud");
    } catch {
      message.error("Failed to delete category");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="max-w-md w-full">
        <Title level={4}>Delete Category</Title>
        <Text type="secondary" className="block mb-4">
          Are you sure you want to delete this category (#{categoryId})?
          <br />
          This action cannot be undone.
        </Text>
        <Space>
          <Button
            danger
            type="primary"
            loading={isLoading}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </Space>
      </Card>
    </div>
  );
}
