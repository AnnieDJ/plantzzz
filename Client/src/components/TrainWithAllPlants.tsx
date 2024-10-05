import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/TrainWithAllPlants.module.css";

interface Question {
  QuestionContent: string;
  PlantImages: string;
  CorrectAnswer: string;
  Options: string[];
}

const TrainWithAllPlants: React.FC = () => {
  const location = useLocation();
  const questions: Question[] = location.state?.questions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    if (!isQuestionVisible) {
      const answerTimer = setTimeout(() => {
        setShowNextButton(true);
      }, 2000);
      return () => clearTimeout(answerTimer);
    }
  }, [isQuestionVisible]);

  useEffect(() => {
    setIsQuestionVisible(true);
    setShowCorrectAnswer(false);
    setShowNextButton(false);
    setSelectedOption(null);
  }, [currentQuestionIndex]);

  const handleOptionClick = (
    optionIndex: number,
    optionText: string,
    correctAnswer: string
  ) => {
    if (selectedOption === null) {
      setSelectedOption(optionIndex);
      const correct = correctAnswer === optionText;
      if (correct) {
        setScore((prevScore) => prevScore + 5);
      } else {
        setShowCorrectAnswer(true);
      }
      setIsQuestionVisible(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz finished! Your final score is ${score}`);
    }
  };

  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log("Current Question:", currentQuestion);

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <h1>Plant Quiz</h1>
        <p>Score: {score}</p>
      </div>
      <div className={styles.imageContainer}>
        <img
          src={`/src/assets/plantPic/${currentQuestion.PlantImages}`}
          alt="Plant"
          className={styles.plantImage}
        />
        <span className={styles.questionCounter}>
          {currentQuestionIndex + 1}/{questions.length}
        </span>
      </div>
      <div className={styles.questionContainer} key={currentQuestionIndex}>
        <p className={styles.questionPrompt}>
          {currentQuestion.QuestionContent}
        </p>
        <div className={styles.optionsContainer}>
          {currentQuestion.Options.map((option, index) => (
            <button
              key={`${currentQuestionIndex}-${index}`}
              className={`${styles.optionButton} ${
                selectedOption === index &&
                (option === currentQuestion.CorrectAnswer
                  ? styles.correct
                  : styles.incorrect)
              }`}
              style={{
                backgroundColor:
                  showCorrectAnswer && option === currentQuestion.CorrectAnswer
                    ? "green"
                    : undefined,
              }}
              onClick={() =>
                handleOptionClick(index, option, currentQuestion.CorrectAnswer)
              }
            >
              {option}
            </button>
          ))}
        </div>
        {showNextButton && (
          <button className={styles.nextButton} onClick={goToNextQuestion}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainWithAllPlants;
