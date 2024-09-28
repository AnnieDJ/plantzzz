import { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import quizblankIcon from "../assets/FillingBlankQueIcon.png";
import quizsingleIcon from "../assets/SingleChoiceQueIcon.png";
import quiztrueorfalseIcon from "../assets/TrueFalseQueIcon.png";
import quizpracticeIcon from "../assets/TrainWithAllPlantIcon.png";

import styles from "../styles/LoggedHome.module.css";

const LoggedHome = () => {
  const termOptions = [
    { value: "2110101", label: "LASC 211 S1, Test 1" },
    { value: "2110102", label: "LASC 211 S1, Test 2" },
    { value: "206201", label: "LASC 206 S2, Test 1" },
    { value: "206202", label: "LASC 206 S2, Test 2" },
  ];

  const [isQuiz, setIsQuiz] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0].value);
  const [loading, setLoading] = useState(false); // 添加加载状态
  const username = localStorage.getItem("username") || "Guest";
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsQuiz(!isQuiz);
  };

  // 模拟加载效果
  const handleTermChange = (event) => {
    setLoading(true); // 开始加载
    setSelectedTerm(event.target.value);
    setTimeout(() => {
      setLoading(false); // 停止加载
    }, 1000); // 模拟加载时间
  };

  const handleTrainWithAllPlants = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/train-questions?term=${selectedTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/LoggedHome/Train-with-allPlants", {
          state: { questions: data },
        });
      } else {
        alert(`Failed to fetch training questions: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching training questions:", error);
      alert(
        "An error occurred while fetching training questions. Please try again."
      );
    }
  };

  const handleSingleChoiceQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/single-choice-questions?term=${selectedTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/LoggedHome/Single-Choice-Quiz", {
          state: { questions: data },
        });
      } else {
        alert(`Failed to fetch single-choice questions: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching single-choice questions:", error);
      alert(
        "An error occurred while fetching single-choice questions. Please try again."
      );
    }
  };

  const handleBlankFillingQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/Blank-Filling-Quiz?term=${selectedTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/LoggedHome/Blank-Filling-Quiz", {
          state: { questions: data },
        });
      } else {
        alert(`Failed to fetch blank-filling questions: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching blank-filling questions:", error);
      alert(
        "An error occurred while fetching blank-filling questions. Please try again."
      );
    }
  };
  
  const handleTrueOrFalseQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/True-Or-False-Quiz?term=${selectedTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/LoggedHome/True-Or-False-Quiz", {
          state: { questions: data },
        });
      } else {
        alert(`Failed to fetch blank-filling questions: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching true-or-false questions:", error);
      alert(
        "An error occurred while fetching true-or-false questions. Please try again."
      );
    }
  };

  

  const sliderSettings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.homepageHomeContainer}>
      <div className={styles.homepageInnerContainer}>
        <div className={styles.quizDropdown}>
          {loading ? (
            <div className={styles.loadingSpinner}>Loading...</div>
          ) : (
            <select
              value={selectedTerm}
              onChange={handleTermChange}
              disabled={isQuiz} // 如果是 Quiz 模式，禁用下拉框
            >
              {termOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{
                    backgroundColor:
                      option.value === selectedTerm
                        ? "#647842" // 已选项背景色
                        : "#ccc", // 灰色背景表示禁用的选项
                    color: option.value === selectedTerm ? "white" : "black",
                  }}
                  disabled={isQuiz && option.value !== selectedTerm} // 禁用非选中的选项
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <h2>Welcome, {username}</h2>

        <div className={styles.toggleSwitch}>
          <span
            className={`${styles.switchOption} ${!isQuiz ? styles.active : ""}`}
            onClick={handleSwitch}
          >
            Practice
          </span>
          <span
            className={`${styles.switchOption} ${isQuiz ? styles.active : ""}`}
            onClick={handleSwitch}
          >
            Quiz
          </span>
        </div>

        {isQuiz ? (
          <div className={styles.quizCarousel}>
            <Slider {...sliderSettings}>
              <div className={styles.carouselItem}
              onClick={handleTrueOrFalseQuiz}>
                <img
                  src={quiztrueorfalseIcon}
                  alt="True/False Icon"
                  className={styles.fullSizeImage}
                />
              </div>
              <div
                className={styles.carouselItem}
                onClick={handleSingleChoiceQuiz}
              >
                <img
                  src={quizsingleIcon}
                  alt="Single-choice Icon"
                  className={styles.fullSizeImage}
                />
              </div>

              <div
                className={styles.carouselItem}
                onClick={handleBlankFillingQuiz}
              >
                <img
                  src={quizblankIcon}
                  alt="Blank Filling Icon"
                  className={styles.fullSizeImage}
                />
              </div>
            </Slider>
          </div>
        ) : (
          <div className={styles.practiceCarousel}>
            <div
              className={styles.practiceItem}
              onClick={handleTrainWithAllPlants}
            >
              <img
                src={quizpracticeIcon}
                alt="Practice Icon"
                className={styles.fullSizeImage}
              />
            </div>
          </div>
        )}

        <div className={styles.bottomNav}>
          <button className={styles.navButton} onClick={() => navigate("/")}>
            <i className="fas fa-home"></i>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate("/leaderboard")}
          >
            <i className="fas fa-trophy"></i>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate("/LoggedHome/PersonalProfile")}
          >
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoggedHome;
