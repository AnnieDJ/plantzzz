import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/BlankFillingQuiz.module.css";
import { useLocation } from "react-router-dom";

interface Question {
  QuestionContent: string;
  PlantImages: string;
  CorrectAnswer: string;
}

const FillInTheBlanksQuiz: React.FC = () => {
  const location = useLocation();
  const questionsFromState = location.state?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(questionsFromState);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(20);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setShowCorrectAnswer(false);

    intervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalRef.current!);
          handleTimeExpired();
          return 0;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex]);

  const handleTimeExpired = () => {
    setShowCorrectAnswer(true); // Show correct answer when time expires
    if (userAnswer.trim() === "") {
      // If no answer was submitted, assume incorrect
      setUserAnswer(""); // Reset the answer input
    }
  };

  const handleSubmit = () => {
    clearInterval(intervalRef.current!);
    setShowCorrectAnswer(true);
    const correct = questions[currentQuestionIndex].CorrectAnswer === userAnswer.trim();
    if (correct) {
      setScore(score + 5);
    }
  };

  const goToNextQuestion = () => {
    setShowCorrectAnswer(false);
    setUserAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`The quiz is over! Your final score is ${score}`);
    }
    setTimer(15); // Reset the timer for the next question
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <h1 className={styles.timer}>Time Left: {timer}s</h1>
        <p className={styles.score}>Score: {score}</p>
      </div>
      <div className={styles.imageContainer}>
        <img
          src={`/src/assets/plantPic/${currentQuestion.PlantImages}.png`}
          alt="Plant"
          className={styles.plantImage}
        />
      </div>
      <div className={styles.questionContainer}>
        <p className={styles.questionPrompt}>
          {currentQuestion.QuestionContent}
        </p>
        {showCorrectAnswer ? (
          <div>
            <div className={styles.correctAnswer}>
              Correct Answer: {currentQuestion.CorrectAnswer}
            </div>
            <button onClick={goToNextQuestion} className={styles.nextButton}>
              Next
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={styles.answerInput}
              placeholder="Type your answer here"
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillInTheBlanksQuiz;
