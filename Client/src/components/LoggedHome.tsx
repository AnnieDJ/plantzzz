import React, { useState } from "react";
import Slider from "react-slick"; // 引入 react-slick 轮播图组件

import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/HomeInLogined.png";
import profileIcon from "../assets/Profile.png";
import quizblankIcon from "../assets/FillingBlankQueIcon.png";
import quizsingleIcon from "../assets/SingleChoiceQueIcon.png";
import quiztrueorfalseIcon from "../assets/TrueFalseQueIcon.png";
import quizpracticeIcon from "../assets/TrainWithAllPlantIcon.png";
import rankingIcon from "../assets/Ranking.png";
import styles from "../styles/LoggedHome.module.css"; // 使用 CSS Modules

const LoggedHome = () => {
  const [isQuiz, setIsQuiz] = useState(false); // 切换 Practice 和 Quiz
  const username = localStorage.getItem("username") || "Guest"; // 从 localStorage 获取用户名
  const navigate = useNavigate(); // 导航钩子，用于页面跳转

  const handleSwitch = () => {
    setIsQuiz(!isQuiz); // 切换 Practice 和 Quiz
  };

  // 配置 react-slick 轮播图的设置
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
        {/* 左上角的题库选择下拉菜单 */}
        <div className={styles.quizDropdown}>
          <select>
            <option value="test1">LASC 211 S1, Test 1</option>
            <option value="test2">LASC 211 S1, Test 2</option>
            <option value="test3">LASC 206 S2, Test 1</option>
            <option value="test4">LASC 206 S2, Test 2</option>
          </select>
        </div>

        <h2>Welcome, {username}</h2>

        {/* Practice 和 Quiz 的切换按钮 */}
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

        {/* 根据 isQuiz 的值来决定显示 Quiz 轮播图或 Practice 区域 */}
        {isQuiz ? (
          <div className={styles.quizCarousel}>
            <Slider {...sliderSettings}>
              <div className={styles.carouselItem}>
                <img
                  src={quiztrueorfalseIcon}
                  alt="True/False Icon"
                  className={
                    styles.fullSizeImage
                  } /* 使用一个新的样式类，使图片占满整个轮播图项目 */
                />
              </div>
              <div className={styles.carouselItem}>
                <img
                  src={quizsingleIcon}
                  alt="Single-choice Icon"
                  className={styles.fullSizeImage}
                />
              </div>
              <div className={styles.carouselItem}>
                <img
                  src={quizblankIcon}
                  alt="All Plants Icon"
                  className={styles.fullSizeImage}
                />
              </div>
            </Slider>
          </div>
        ) : (
          <div className={styles.practiceCarousel}>
            <div className={styles.practiceItem}>
              <img
                src={quizpracticeIcon}
                alt="Practice Icon"
                className={styles.fullSizeImage}
              />
            </div>
          </div>
        )}

        {/* 底部的自定义导航按钮 */}
        <div className={styles.bottomNav}>
          <img src={homeIcon} alt="Home" onClick={() => navigate("/")} />
          <img
            src={rankingIcon}
            alt="Leaderboard"
            onClick={() => navigate("/leaderboard")}
          />
          <img
            src={profileIcon}
            alt="Profile"
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoggedHome;
