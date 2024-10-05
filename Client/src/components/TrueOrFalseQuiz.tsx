// TrueOrFalseQuiz.jsx

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "../styles/TrueOrFalseQuiz.module.css";

// const TrueOrFalseQuiz = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { questions } = location.state || {};

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timer, setTimer] = useState(5);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isAnswered, setIsAnswered] = useState(false);

//   useEffect(() => {
//     if (!questions || !questions.length) {
//       console.error("No questions data available.");
//       navigate("/LoggedHome");
//     }
//   }, [questions, navigate]);

//   useEffect(() => {
//     if (!questions || !questions.length) return;

//     if (timer === 0) {
//       handleAnswer(null);
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer, questions, currentQuestionIndex]);

//   const handleAnswer = (userAnswer) => {
//     if (isAnswered) return; // Prevent multiple answers

//     setSelectedAnswer(userAnswer);
//     setIsAnswered(true);

//     const currentQuestion = questions[currentQuestionIndex];
//     const correctAnswer = currentQuestion.correct_answer;

//     if (userAnswer === correctAnswer) {
//       setScore((prevScore) => prevScore + 5);
//     }

//     // Wait for 1.5 seconds before moving to the next question
//     setTimeout(() => {
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//         setTimer(5);
//         setSelectedAnswer(null);
//         setIsAnswered(false);
//       } else {
//         alert(`测验结束！您的最终得分是 ${score}`);
//         navigate("/LoggedHome");
//       }
//     }, 1500);
//   };

//   if (!questions || !questions.length) {
//     return <div>没有可用的题目。</div>;
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className={styles.container}>
//       <div className={styles.quizHeader}>
//         <p className={styles.score}>得分：{score}</p>
//         <h1 className={styles.timer}>剩余时间：{timer} 秒</h1>
//       </div>
//       <div className={styles.imageContainer}>
//         <img
//           src={`/src/assets/plantPic/${currentQuestion.image_id}.png`}
//           alt="Plant"
//           className={styles.plantImage}
//         />
//         <span className={styles.questionCounter}>
//           {currentQuestionIndex + 1}/{questions.length}
//         </span>
//       </div>
//       <div className={styles.questionContainer}>
//         <p className={styles.questionPrompt}>{currentQuestion.question}</p>
//         <div className={styles.optionsContainer}>
//           <button
//             className={`${styles.optionButton} ${
//               isAnswered
//                 ? currentQuestion.correct_answer === true
//                   ? styles.correct
//                   : selectedAnswer === true
//                   ? styles.incorrect
//                   : ""
//                 : ""
//             }`}
//             onClick={() => handleAnswer(true)}
//             disabled={isAnswered}
//           >
//             True
//           </button>
//           <button
//             className={`${styles.optionButton} ${
//               isAnswered
//                 ? currentQuestion.correct_answer === false
//                   ? styles.correct
//                   : selectedAnswer === false
//                   ? styles.incorrect
//                   : ""
//                 : ""
//             }`}
//             onClick={() => handleAnswer(false)}
//             disabled={isAnswered}
//           >
//             False
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrueOrFalseQuiz;

// src/components/TrueOrFalseQuiz.tsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/TrueOrFalseQuiz.module.css";
import axios from "axios";
import backendUrl from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  question: string;
  image_id: string;
  correct_answer: boolean;
}

const TrueOrFalseQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionsFromState: Question[] = location.state?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(questionsFromState);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!questions.length) return;

    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimer(5); // reset timer

    // begin timer
    intervalRef.current = window.setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          handleAnswer(null);
          return 0;
        }
      });
    }, 1000);

    return () => {
      // clear timer
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (userAnswer: boolean | null) => {
    if (isAnswered) return; // Prevent multiple answers

    setSelectedAnswer(userAnswer);
    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (userAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 5);
    }

    // wait one second to jump to next
    setTimeout(() => {
      goToNextQuestion();
    }, 1000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // complete all questions,upload score
      uploadScore();
    }
    setTimer(5); // reset timer
  };

  const uploadScore = () => {
    setIsSubmitting(true);
    setUploadProgress(0);

    const data = {
      TotalFillBlankScore: 0,
      TotalSingleScore: 0,
      TotalTrueFalseScore: score,
    };

    // simulateProgress
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
        toast.success("score upload success,your final score is " + score, {
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

  if (!questions.length) {
    return <div>no questions avaliable</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

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
            <p className={styles.score}>score:{score}</p>
            <h1 className={styles.timer}>time left:{timer} s</h1>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={`/src/assets/plantPic/${currentQuestion.image_id}`}
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
        </>
      )}
    </div>
  );
};

export default TrueOrFalseQuiz;
