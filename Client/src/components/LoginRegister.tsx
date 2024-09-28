import React, { useState } from "react";
import { Tabs } from "antd"; // 引入 Ant Design 的 Tabs 组件
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css"; // 引入 Ant Design 的全局样式
import styles from "../styles/LoginRegister.module.css";

const { TabPane } = Tabs;

const LoginRegTabs: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // 用于页面跳转

  const handleSignUp = async () => {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful!");
      navigate("/LoggedHome");
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  };

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);
      if (data.role === "Admin") {
        navigate("/AdminLoggedHome");
      } else {
        navigate("/LoggedHome");
      }
    } else {
      alert(`Login failed: ${data.message}`);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.centeredBackground}>
        <div className={styles.formBox}>
          <Tabs defaultActiveKey="1" centered>
            <TabPane
              tab={
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  Sign Up
                </span>
              }
              key="1"
            >
              <h2 style={{ color: "white" }}>Sign Up Here</h2>
              <input
                type="text"
                placeholder="User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className={styles.submitBtn} onClick={handleSignUp}>
                Sign Up
              </button>
            </TabPane>

            <TabPane
              tab={
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  Login
                </span>
              }
              key="2"
            >
              <h2 style={{ color: "white" }}>Login Here</h2>
              <input
                type="text"
                placeholder="User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className={styles.submitBtn} onClick={handleLogin}>
                Login
              </button>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginRegTabs;
