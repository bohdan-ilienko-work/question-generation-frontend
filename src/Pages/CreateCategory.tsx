import { useState } from "react";
import {
  useCreateCategoryMutation,
  useTranslateCategoryMutation,
} from "../state";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Card,
  Row,
  Col,
} from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const ALL_LANGUAGES = ["en", "uk", "es", "ru", "fr", "de", "it", "pl", "tr"];

export default function CreateCategory() {
  const navigate = useNavigate();
  const { parentId } = useParams();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [translateCategory, { isLoading: isTranslating }] =
    useTranslateCategoryMutation();
  const [form] = Form.useForm();

  const [locales, setLocales] = useState<{ language: string; value: string }[]>(
    [{ language: "en", value: "" }]
  );

  const handleAddLocale = () => {
    const usedLanguages = locales.map((l) => l.language);
    const available = ALL_LANGUAGES.find(
      (lang) => !usedLanguages.includes(lang)
    );
    if (!available) return;
    setLocales([...locales, { language: available, value: "" }]);
  };

  const handleRemoveLocale = (language: string) => {
    setLocales(locales.filter((l) => l.language !== language));
  };

  const handleChangeLanguage = (oldLang: string, newLang: string) => {
    if (locales.some((l) => l.language === newLang)) return;
    setLocales(
      locales.map((l) =>
        l.language === oldLang ? { ...l, language: newLang } : l
      )
    );
  };
  const handleTranslate = async (originalText: string) => {
    try {
      const response = await translateCategory({
        requiredLocales: ALL_LANGUAGES.filter(
          (lang) => !locales.some((l) => l.language === lang)
        ),
        originalText,
        sourceLanguage: locales[0].language,
      }).unwrap();

      const translatedLocales = response.responseObject; // 🔥 уже массив

      setLocales((prev) => [
        ...prev,
        ...translatedLocales.filter(
          (t) => !prev.some((l) => l.language === t.language)
        ),
      ]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to translate category: " + errorMessage);
    }
  };

  const handleChangeValue = (language: string, value: string) => {
    setLocales(
      locales.map((l) => (l.language === language ? { ...l, value } : l))
    );
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      await createCategory({
        name: values.name,
        parentId: Number(parentId),
        locales,
      }).unwrap();
      form.resetFields();
      setLocales([{ language: "en", value: "" }]);

      alert("Category created successfully");
      navigate("/categories-crud");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to create category: " + errorMessage);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 p-6 h-full">
      <Card className="w-full max-w-3xl">
        <Title level={4} className="flex justify-between items-center">
          <span>Create Category</span>
          <Button type="link" onClick={() => window.history.back()}>
            Back
          </Button>
        </Title>

        {parentId && (
          <Text type="secondary" className="block mb-4">
            <strong>Parent ID:</strong> {parentId}
          </Text>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Default category name" />
          </Form.Item>

          <div className="mb-2 flex justify-between items-center">
            <Text strong>Locales</Text>
            <Button
              type="link"
              loading={isTranslating}
              disabled={locales.length === ALL_LANGUAGES.length}
              onClick={() => handleTranslate(locales[0].value)}
            >
              Generate locales (by DeepL)
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {locales.map((loc) => (
              <Col xs={24} sm={12} key={loc.language}>
                <Space align="start" className="w-full">
                  <Select
                    value={loc.language}
                    onChange={(val) => handleChangeLanguage(loc.language, val)}
                    style={{ width: 100 }}
                  >
                    {ALL_LANGUAGES.map((lang) => (
                      <Option
                        key={lang}
                        value={lang}
                        disabled={locales.some(
                          (l) =>
                            l.language === lang && l.language !== loc.language
                        )}
                      >
                        {lang.toUpperCase()}
                      </Option>
                    ))}
                  </Select>
                  <Input
                    placeholder={`Value for ${loc.language}`}
                    value={loc.value}
                    onChange={(e) =>
                      handleChangeValue(loc.language, e.target.value)
                    }
                    className="w-full"
                  />
                  {locales.length > 1 && (
                    <Button
                      type="link"
                      danger
                      onClick={() => handleRemoveLocale(loc.language)}
                    >
                      ✕
                    </Button>
                  )}
                </Space>
              </Col>
            ))}
          </Row>

          {locales.length < ALL_LANGUAGES.length && (
            <Button type="link" onClick={handleAddLocale} className="mt-2">
              + Add locale
            </Button>
          )}

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
