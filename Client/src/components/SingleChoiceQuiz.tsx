import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/SingleChoiceQuiz.module.css";

interface Question {
  QuestionContent: string;
  PlantImages: string;
  CorrectAnswer: string; // 应该是选项的字母，例如 "A"
  AnswerOptionA: string;
  AnswerOptionB: string;
  AnswerOptionC: string;
  AnswerOptionD: string;
}

const SingleChoiceQuiz: React.FC = () => {
  const location = useLocation();
  const questions: Question[] = location.state?.questions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(5); // 添加计时器

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 使用 useRef 存储计时器引用

  useEffect(() => {
    setShowCorrectAnswer(false);
    setSelectedOption(null);
    setTimer(5); // 重置计时器

    // 启动计时器
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          // 计时器到0，清除计时器，显示正确答案，1秒后跳转到下一题
          if (intervalRef.current) clearInterval(intervalRef.current);
          setShowCorrectAnswer(true);
          setTimeout(() => {
            goToNextQuestion();
          }, 500); // 等待1秒
          return 0;
        }
      });
    }, 500);

    return () => {
      // 清除计时器
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (selectedOption !== null) {
      // 用户已选择答案，清除计时器，1秒后跳转到下一题
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => {
        goToNextQuestion();
      }, 500); // 等待1秒
    }
  }, [selectedOption]);

  const handleOptionClick = (option: string, correctAnswer: string) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      const correct = correctAnswer === option;
      if (correct) {
        setScore((prevScore) => prevScore + 5); // 每个正确答案加5分
      }
      setShowCorrectAnswer(true);
      // 在上面的 useEffect 中处理跳转到下一题
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`The quiz is over! Your final score is ${score}`);
      // 可以在这里重定向到其他页面或重置测验
    }
  };

  if (questions.length === 0) {
    return <p>No questions</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        
        <p>Scores：{score}</p>
        <h1 className={styles.timer}>Time Left: {timer} s</h1> {/* 显示计时器 */}
      </div>
      <div className={styles.imageContainer}>
        <img
          src={`/src/assets/plantPic/${currentQuestion.PlantImages}.png`}
          alt="Plant"
          className={styles.plantImage}
        />
        <span className={styles.questionCounter}>
          {currentQuestionIndex + 1}/{questions.length}
        </span>
      </div>
      <div
        className={styles.questionContainer}
        key={currentQuestionIndex} // 添加 key 强制重新渲染
      >
        <p className={styles.questionPrompt}>
          {currentQuestion.QuestionContent}
        </p>
        <div className={styles.optionsContainer}>
          {["A", "B", "C", "D"].map((option) => (
            <button
              key={`${currentQuestionIndex}-${option}`} // 修改 key
              className={`${styles.optionButton} ${
                selectedOption === option &&
                (currentQuestion.CorrectAnswer === option
                  ? styles.correct
                  : styles.incorrect)
              }`}
              style={{
                backgroundColor:
                  showCorrectAnswer &&
                  currentQuestion.CorrectAnswer === option
                    ? "green"
                    : undefined,
              }}
              onClick={() =>
                handleOptionClick(option, currentQuestion.CorrectAnswer)
              }
              disabled={selectedOption !== null} // 防止重复点击
            >
              {currentQuestion[`AnswerOption${option}`]}
            </button>
          ))}
        </div>
        {/* 移除“下一题”按钮 */}
      </div>
    </div>
  );
};

export default SingleChoiceQuiz;
