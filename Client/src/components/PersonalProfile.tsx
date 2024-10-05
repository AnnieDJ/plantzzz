import React, { useState, useEffect, useRef } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "../styles/PersonalProfile.module.css";
import { useNavigate } from "react-router-dom";
import backendUrl from "../config";

const UserProfile = () => {
  const username = localStorage.getItem("username") || "username";
  const email = localStorage.getItem("email") || "12345@example.com";

  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [uploadMessage, setUploadMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token available.");
          return;
        }
        const response = await fetch(`${backendUrl}/api/auth/get_avatar`, {
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
    if (localStorage.getItem("role") === "Admin") {
      navigate("/AdminLoggedHome");
    } else {
      navigate("/LoggedHome");
    }
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
      const response = await fetch(`${backendUrl}/api/auth/change_password`, {
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

        setNewPassword("");
        setConfirmNewPassword("");

        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
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

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${backendUrl}/api/auth/upload_avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(backendUrl + data.avatar_url);
        setUploadMessage("Avatar uploaded successfully!");
      } else {
        setUploadMessage("Failed to upload avatar.");
      }
    } catch (error) {
      setUploadMessage("Error uploading avatar.");
    }

    setShowUploadModal(true);

    setTimeout(() => {
      setShowUploadModal(false);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
          <button
            className={`${styles.btn} ${styles.logout}`}
            title="Log out"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> <span>Log out</span>
          </button>
        </div>

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
