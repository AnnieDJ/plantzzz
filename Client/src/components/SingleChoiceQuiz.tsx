// src/components/SingleChoiceQuiz.tsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SingleChoiceQuiz.module.css";
import axios from "axios";
import backendUrl from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  QuestionContent: string;
  PlantImages: string;
  CorrectAnswer: string; // correct answer text
  Options: string[];
}

const SingleChoiceQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionsFromState = location.state?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(questionsFromState);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setShowCorrectAnswer(false);
    setSelectedOption(null);
    setTimer(5); // reset timer

    // begin timer
    intervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          setShowCorrectAnswer(true);
          setTimeout(() => {
            goToNextQuestion();
          }, 500); // wait 0.5s
          return 0;
        }
      });
    }, 1000);

    return () => {
      // clear timer
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (selectedOption !== null) {
      // user already choose answer,clear timer, wait 0.5s, then go to next question
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      setTimeout(() => {
        goToNextQuestion();
      }, 500); // wait 0.5s
    }
  }, [selectedOption]);

  const handleOptionClick = (optionText: string) => {
    if (selectedOption === null) {
      setSelectedOption(optionText);
      const correct =
        optionText === questions[currentQuestionIndex].CorrectAnswer;
      if (correct) {
        setScore((prevScore) => prevScore + 5); 
        // every correct answer, add 5 points
      }
      setShowCorrectAnswer(true);
      // fix jumping to next question 
    }
  };

  const goToNextQuestion = () => {
    setShowCorrectAnswer(false);
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // complete all questions ,upload score
      uploadScore();
    }
    setTimer(5); // reset timer
  };

  const uploadScore = () => {
    setIsSubmitting(true);
    setUploadProgress(0);

    const data = {
      TotalSingleScore: score,
      TotalTrueFalseScore: 0,
      TotalFillBlankScore: 0,
    };

    // simulate progress
    const simulateProgress = () => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 10;
      });
    };

    const progressInterval = window.setInterval(simulateProgress, 200);

    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("can't find access token.please login again.");
      setIsSubmitting(false);
      return;
    }

    axios
      .post(`${backendUrl}/api/score/submit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        toast.success("score upload success!Your final score is" + score, {
          onClose: () => navigate(-1),
          autoClose: 3000,
        });
      })
      .catch((error) => {
        clearInterval(progressInterval);
        setUploadProgress(0);
        console.error("upload score error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(`upload score error: ${error.response.data.message}`);
        } else {
          toast.error("upload score error,please try again.");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log("Current Question:", currentQuestion);

  return (
    <div className={styles.container}>
      <ToastContainer />
      {isSubmitting && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p>Uploading score... {uploadProgress}%</p>
        </div>
      )}
      {!isSubmitting && (
        <>
          <div className={styles.quizHeader}>
            <p>Scores: {score}</p>
            <h1 className={styles.timer}>Time Left: {timer} s</h1>
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
          <div
            className={styles.questionContainer}
            key={currentQuestionIndex} 
          >
            <p className={styles.questionPrompt}>
              {currentQuestion.QuestionContent}
            </p>
            <div className={styles.optionsContainer}>
              {currentQuestion.Options.map((option, index) => (
                <button
                  key={`${currentQuestionIndex}-option-${index}`} 
                  className={`${styles.optionButton} ${
                    selectedOption === option
                      ? option === currentQuestion.CorrectAnswer
                        ? styles.correct
                        : styles.incorrect
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      showCorrectAnswer &&
                      option === currentQuestion.CorrectAnswer
                        ? "green"
                        : selectedOption === option &&
                          option !== currentQuestion.CorrectAnswer
                        ? "red"
                        : undefined,
                  }}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null} // prevent repeated clicks
                >
                  {option}
                </button>
              ))}
            </div>
            {/* remove next question*/}
          </div>
        </>
      )}
    </div>
  );
};

export default SingleChoiceQuiz;
