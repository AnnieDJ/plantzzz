import React, { useState } from "react";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "antd/dist/reset.css";
import styles from "../styles/LoginRegister.module.css";
import backendUrl from "../config";

const { TabPane } = Tabs;

const LoginRegTabs: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();


  const handleSignUp = async () => {
    try {
      
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          username,
          email,
          password,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );
  
      alert("Registration successful!");
  
    
      const loginResponse = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const loginData = loginResponse.data;
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("email", loginData.email);
      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("user_id", loginData.user_id);
      localStorage.setItem("role", loginData.role);
      navigate("/LoggedHome");
    } catch (error) {
      alert(
        `Registration or login failed: ${error.response?.data?.message || error.message}`
      );
    }
  };
  

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
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
    } catch (error) {
      // 处理错误
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
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
