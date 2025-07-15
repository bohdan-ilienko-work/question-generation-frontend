import { useReducer } from "react";
import { useLoginMutation } from "../state/api/authApi";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../state/slices/authSlice";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Typography, Card, Alert, Space, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

type State = {
  username: string;
  password: string;
  error: string | null;
};
type Action =
  | { type: "SET_FIELD"; field: "username" | "password"; value: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

const initialState: State = {
  username: "",
  password: "",
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMutation, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatchAction = useDispatch();

  const [api, contextHolder] = notification.useNotification();

  const handleFinish = async (values: { username: string; password: string }) => {
    dispatch({ type: "SET_ERROR", error: null });
    try {
      const tokens = await loginMutation(values).unwrap();
      dispatchAction(setTokens(tokens.responseObject));
      navigate("/");
    } catch {
      dispatch({ type: "SET_ERROR", error: "Incorrect Login Data" });
    }
  };

  const handleForgot = () => {
    api.info({
      message: "Not implemented",
      description: "Forgot password functionality is not yet implemented.",
      placement: "topRight",
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f6fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {contextHolder}
      <Card
        style={{
          width: 380,
          padding: "30px 20px",
          borderRadius: 10,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <img src="/generator/brain-icon.png" alt="QuizMaster Logo" style={{ width: 32, height: 32 }} />
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>QuizMaster</Title>
          </div>
          <Title level={5} style={{ marginBottom: 0 }}>Welcome Back!</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Login to continue to your dashboard.
          </Text>
          {state.error && (
            <Alert
              message={state.error}
              description="Please check your email and password and try again. If you continue to experience issues, consider resetting your password or contact support for assistance."
              type="error"
              showIcon
            />
          )}

          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ username: state.username, password: state.password }}
          >
            <Form.Item
              label="Login"
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Login"
                autoComplete="username"
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "username", value: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{ background: "#ff6600", borderColor: "#ff6600" }}
              >
                Login
              </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ textAlign: "center" }}>
                <Link onClick={handleForgot} style={{ fontSize: 13, cursor: "pointer" }}>
                  Forgot your password?
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
