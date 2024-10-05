import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css"; 
import butterflyImage from "../assets/HomePageButterfly.png"; 

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepageHomeContainer}>
      <div className={styles.homepageInnerContainer}>
        <div className={styles.homepageTitleContainer}>
          <img
            src={butterflyImage}
            alt="Butterfly"
            className={styles.homepageButterfly}
          />
          <h1 className={styles.homepageTitle}>PLANTZZZ</h1>
        </div>
        <div className={styles.homepageButtonContainer}>
          <button
            className={styles.homepageGetStarted}
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
        </div>
        <div className={styles.homepageRegisterContainer}>
          <p>No account yet?</p>
          <span
            className={styles.homepageRegister} // Keep the same class for styling
            onClick={() => navigate("/auth")} // Same onClick event handler
            style={{ cursor: "pointer", color: "white", fontSize: "13px" }} // Add pointer cursor and optional text color
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
