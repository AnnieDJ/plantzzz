// import React, { useState, useEffect, useRef } from "react";
// import styles from "../styles/BlankFillingQuiz.module.css";
// import { useLocation } from "react-router-dom";

// interface Question {
//   QuestionContent: string;
//   PlantImages: string;
//   CorrectAnswer: string;
// }

// const FillInTheBlanksQuiz: React.FC = () => {
//   const location = useLocation();
//   const questionsFromState = location.state?.questions || [];
//   const [questions, setQuestions] = useState<Question[]>(questionsFromState);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [score, setScore] = useState(0);
//   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
//   const [timer, setTimer] = useState(20);

//   const intervalRef = useRef<number | null>(null);

//   useEffect(() => {
//     setShowCorrectAnswer(false);

//     intervalRef.current = window.setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer > 1) {
//           return prevTimer - 1;
//         } else {
//           clearInterval(intervalRef.current!);
//           handleTimeExpired();
//           return 0;
//         }
//       });
//     }, 1000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [currentQuestionIndex]);

//   const handleTimeExpired = () => {
//     setShowCorrectAnswer(true); // Show correct answer when time expires
//     if (userAnswer.trim() === "") {
//       // If no answer was submitted, assume incorrect
//       setUserAnswer(""); // Reset the answer input
//     }
//   };

//   const handleSubmit = () => {
//     clearInterval(intervalRef.current!);
//     setShowCorrectAnswer(true);
//     const correct = questions[currentQuestionIndex].CorrectAnswer === userAnswer.trim();
//     if (correct) {
//       setScore(score + 5);
//     }
//   };

//   const goToNextQuestion = () => {
//     setShowCorrectAnswer(false);
//     setUserAnswer("");
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       alert(`The quiz is over! Your final score is ${score}`);
//     }
//     setTimer(15); // Reset the timer for the next question
//   };

//   if (questions.length === 0) {
//     return <p>Loading questions...</p>;
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className={styles.container}>
//       <div className={styles.quizHeader}>
//         <h1 className={styles.timer}>Time Left: {timer}s</h1>
//         <p className={styles.score}>Score: {score}</p>
//       </div>
//       <div className={styles.imageContainer}>
//         <img
//           src={`/src/assets/plantPic/${currentQuestion.PlantImages}.png`}
//           alt="Plant"
//           className={styles.plantImage}
//         />
//       </div>
//       <div className={styles.questionContainer}>
//         <p className={styles.questionPrompt}>
//           {currentQuestion.QuestionContent}
//         </p>
//         {showCorrectAnswer ? (
//           <div>
//             <div className={styles.correctAnswer}>
//               Correct Answer: {currentQuestion.CorrectAnswer}
//             </div>
//             <button onClick={goToNextQuestion} className={styles.nextButton}>
//               Next
//             </button>
//           </div>
//         ) : (
//           <div>
//             <input
//               type="text"
//               value={userAnswer}
//               onChange={(e) => setUserAnswer(e.target.value)}
//               className={styles.answerInput}
//               placeholder="Type your answer here"
//             />
//             <button onClick={handleSubmit} className={styles.submitButton}>
//               Submit
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FillInTheBlanksQuiz;

// src/components/FillInTheBlanksQuiz.tsx
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/BlankFillingQuiz.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import backendUrl from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  QuestionContent: string;
  PlantImages: string;
  CorrectAnswer: string;
  QuestionID?: number;
}

const FillInTheBlanksQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionsFromState = location.state?.questions || [];
  const [questions, setQuestions] = useState<Question[]>(questionsFromState);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setShowCorrectAnswer(false);

    intervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          handleTimeExpired();
          return 0;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex]);

  const handleTimeExpired = () => {
    setShowCorrectAnswer(true);
    if (userAnswer.trim() === "") {
      setUserAnswer("");
    }
  };

  const handleSubmit = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setShowCorrectAnswer(true);
    const correct =
      questions[currentQuestionIndex].CorrectAnswer === userAnswer.trim();
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
      uploadScore();
    }
    setTimer(15);
  };

  const uploadScore = () => {
    setIsSubmitting(true);
    setUploadProgress(0);

    const data = {
      TotalFillBlankScore: score,
      TotalSingleScore: 0,
      TotalTrueFalseScore: 0,
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
      toast.error("can't find access token,please login again.");
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
        toast.success("Score upload success!Your final socre is" + score, {
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
          toast.error("upload score error,please try again later.");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
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
            <h1 className={styles.timer}>Time Left: {timer}s</h1>
            <p className={styles.score}>Score: {score}</p>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={`/src/assets/plantPic/${currentQuestion.PlantImages}`}
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
                <button
                  onClick={goToNextQuestion}
                  className={styles.nextButton}
                >
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
        </>
      )}
    </div>
  );
};

export default FillInTheBlanksQuiz;
