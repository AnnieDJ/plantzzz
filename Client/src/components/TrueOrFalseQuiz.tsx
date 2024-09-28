// TrueOrFalseQuiz.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/TrueOrFalseQuiz.module.css";

const TrueOrFalseQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (!questions || !questions.length) {
      console.error("No questions data available.");
      navigate("/LoggedHome");
    }
  }, [questions, navigate]);

  useEffect(() => {
    if (!questions || !questions.length) return;

    if (timer === 0) {
      handleAnswer(null);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions, currentQuestionIndex]);

  const handleAnswer = (userAnswer) => {
    if (isAnswered) return; // Prevent multiple answers

    setSelectedAnswer(userAnswer);
    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (userAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 5);
    }

    // Wait for 1.5 seconds before moving to the next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(5);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        alert(`测验结束！您的最终得分是 ${score}`);
        navigate("/LoggedHome");
      }
    }, 1500);
  };

  if (!questions || !questions.length) {
    return <div>没有可用的题目。</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <p className={styles.score}>得分：{score}</p>
        <h1 className={styles.timer}>剩余时间：{timer} 秒</h1>
      </div>
      <div className={styles.imageContainer}>
        <img
          src={`/src/assets/plantPic/${currentQuestion.image_id}.png`}
          alt="Plant"
          className={styles.plantImage}
        />
        <span className={styles.questionCounter}>
          {currentQuestionIndex + 1}/{questions.length}
        </span>
      </div>
      <div className={styles.questionContainer}>
        <p className={styles.questionPrompt}>{currentQuestion.question}</p>
        <div className={styles.optionsContainer}>
          <button
            className={`${styles.optionButton} ${
              isAnswered
                ? currentQuestion.correct_answer === true
                  ? styles.correct
                  : selectedAnswer === true
                  ? styles.incorrect
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
          >
            True
          </button>
          <button
            className={`${styles.optionButton} ${
              isAnswered
                ? currentQuestion.correct_answer === false
                  ? styles.correct
                  : selectedAnswer === false
                  ? styles.incorrect
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
          >
            False
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrueOrFalseQuiz;
