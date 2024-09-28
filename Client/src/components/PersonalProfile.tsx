import React, { useState, useEffect, useRef } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "../styles/PersonalProfile.module.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const username = localStorage.getItem("username") || "username";
  const email = localStorage.getItem("email") || "12345@example.com";

  // 添加头像相关的状态和引用
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backendUrl = "http://localhost:5000"; // 后端服务器的地址

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 新增状态用于区分消息类型（成功或错误）

  const [uploadMessage, setUploadMessage] = useState(""); // 用于显示上传头像的消息
  const [showUploadModal, setShowUploadModal] = useState(false); // 控制提示弹窗的显示

  const navigate = useNavigate();

  // 获取头像URL
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token available.");
          return;
        }
        const response = await fetch(`${backendUrl}/api/get_avatar`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(backendUrl + data.avatar_url);
        } else {
          console.log("Failed to fetch avatar. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [backendUrl]);

  const handleBackClick = () => {
    navigate("/LoggedHome");
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPasswordMessage("");
    setMessageType("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleChangePasswordClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    // 重置消息
    setPasswordMessage("");
    setMessageType("");

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordMessage(
        "Password must be at least 8 characters long, include a digit, an uppercase letter, and a lowercase letter."
      );
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage("Password changed successfully.");
        setMessageType("success");
        // 清理输入框
        setNewPassword("");
        setConfirmNewPassword("");
        // 关闭弹窗延迟以显示成功信息
        setTimeout(() => {
          handleCloseModal();
        }, 2000); // 2秒后关闭弹窗
      } else {
        // 根据后端返回的状态码调整消息
        switch (response.status) {
          case 400:
            setPasswordMessage(data.message || "Invalid request.");
            break;
          case 404:
            setPasswordMessage(data.message || "User not found.");
            break;
          case 500:
            setPasswordMessage(
              data.message || "Server error. Please try again."
            );
            break;
          default:
            setPasswordMessage("An unexpected error occurred.");
        }
        setMessageType("error");
      }
    } catch (error) {
      setPasswordMessage("Network error. Please try again.");
      setMessageType("error");
    }
  };

  // 处理头像点击，触发文件选择
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  // 上传头像到后端
  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${backendUrl}/api/upload_avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(backendUrl + data.avatar_url);
        setUploadMessage("Avatar uploaded successfully!"); // 上传成功消息
      } else {
        setUploadMessage("Failed to upload avatar."); // 上传失败消息
      }
    } catch (error) {
      setUploadMessage("Error uploading avatar."); // 处理错误
    }

    setShowUploadModal(true); // 显示上传消息弹窗

    // 3秒后自动关闭上传弹窗
    setTimeout(() => {
      setShowUploadModal(false);
    }, 3000);
  };

  return (
    <div className={styles.ProfilePageContainer}>
      <div className={styles.pageContainer}>
        <div className={styles.profileHeader}>
          <button
            className={styles.backButton}
            onClick={handleBackClick}
            title="Go back"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <div
          className={styles.avatar}
          onClick={handleAvatarClick}
          title="Upload avatar"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className={styles.avatarImage} />
          ) : (
            <IoPersonCircleOutline size={130} />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* 修改密码弹窗 */}
        {showPasswordModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Change Password</h2>
              <input
                type="password"
                placeholder="Enter new password"
                className={styles.passwordInput}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className={styles.passwordInput}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {passwordMessage && (
                <p
                  className={
                    messageType === "success"
                      ? styles.successMessage
                      : styles.errorMessage
                  }
                >
                  {passwordMessage}
                </p>
              )}
              <button
                onClick={handlePasswordSubmit}
                className={styles.modalButton}
              >
                Confirm
              </button>
              <button onClick={handleCloseModal} className={styles.modalButton}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* 上传头像结果提示弹窗 */}
        {showUploadModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p>{uploadMessage}</p>
            </div>
          </div>
        )}

        <div className={styles.userInfo}>
          <button className={styles.btn} title="Username">
            <i className="fas fa-user"></i> <span>{username}</span>
          </button>
          <button className={styles.btn} title="Email">
            <i className="fas fa-envelope"></i> <span>{email}</span>
          </button>
          <button
            className={`${styles.btn} ${styles.changePassword}`}
            onClick={handleChangePasswordClick}
            title="Change Password"
          >
            <i className="fas fa-lock"></i> <span>Change Password</span>
          </button>
          <button className={`${styles.btn} ${styles.logout}`} title="Log out">
            <i className="fas fa-sign-out-alt"></i> <span>Log out</span>
          </button>
        </div>

        {/* 底部导航 */}
        <div className={styles.bottomNav}>
          <button className={styles.navButton} title="Go to home">
            <i className="fas fa-home"></i>
          </button>
          <button className={styles.navButton} title="View leaderboard">
            <i className="fas fa-trophy"></i>
          </button>
          <button className={styles.navButton} title="Go to profile">
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
