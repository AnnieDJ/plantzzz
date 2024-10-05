// import { useState } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";

// import quizblankIcon from "../assets/FillingBlankQueIcon.png";
// import quizsingleIcon from "../assets/SingleChoiceQueIcon.png";
// import quiztrueorfalseIcon from "../assets/TrueFalseQueIcon.png";
// import quizpracticeIcon from "../assets/TrainWithAllPlantIcon.png";

// import styles from "../styles/LoggedHome.module.css";
// import backendUrl from "../config";

// const LoggedHome = () => {
//   const termOptions = [
//     { value: "2110101", label: "LASC 211 S1, Test 1" },
//     { value: "2110102", label: "LASC 211 S1, Test 2" },
//     { value: "206201", label: "LASC 206 S2, Test 1" },
//     { value: "206202", label: "LASC 206 S2, Test 2" },
//   ];

//   const [isQuiz, setIsQuiz] = useState(false);
//   const [selectedTerm, setSelectedTerm] = useState(termOptions[0].value);
//   const [loading, setLoading] = useState(false); // 添加加载状态
//   const username = localStorage.getItem("username") || "Guest";
//   const navigate = useNavigate();

//   const handleSwitch = () => {
//     setIsQuiz(!isQuiz);
//   };

//   // 模拟加载效果
//   const handleTermChange = (event) => {
//     setLoading(true); // 开始加载
//     setSelectedTerm(event.target.value);
//     setTimeout(() => {
//       setLoading(false); // 停止加载
//     }, 1000); // 模拟加载时间
//   };

//   const handleTrainWithAllPlants = async () => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/quizzes/quizzetest/train-questions?term=${selectedTerm}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           mode: "cors",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/LoggedHome/Train-with-allPlants", {
//           state: { questions: data },
//         });
//       } else {
//         alert(`Failed to fetch training questions: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error fetching training questions:", error);
//       alert(
//         "An error occurred while fetching training questions. Please try again."
//       );
//     }
//   };

//   const handleSingleChoiceQuiz = async () => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/single-choice-quizzes/single-choice?term=${selectedTerm}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           mode: "cors",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/LoggedHome/Single-Choice-Quiz", {
//           state: { questions: data },
//         });
//       } else {
//         alert(`Failed to fetch single-choice questions: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error fetching single-choice questions:", error);
//       alert(
//         "An error occurred while fetching single-choice questions. Please try again."
//       );
//     }
//   };

//   const handleBlankFillingQuiz = async () => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/blank-filling-quizzes/blank-filling-quizzes?term=${selectedTerm}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           mode: "cors",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/LoggedHome/Blank-Filling-Quiz", {
//           state: { questions: data },
//         });
//       } else {
//         alert(`Failed to fetch blank-filling questions: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error fetching blank-filling questions:", error);
//       alert(
//         "An error occurred while fetching blank-filling questions. Please try again."
//       );
//     }
//   };

//   const handleTrueOrFalseQuiz = async () => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/true-false/get-true-false-questions?term=${selectedTerm}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           mode: "cors",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/LoggedHome/True-Or-False-Quiz", {
//           state: { questions: data },
//         });
//       } else {
//         alert(`Failed to fetch blank-filling questions: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error fetching true-or-false questions:", error);
//       alert(
//         "An error occurred while fetching true-or-false questions. Please try again."
//       );
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     fade: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div className={styles.homepageHomeContainer}>
//       <div className={styles.homepageInnerContainer}>
//         <div className={styles.quizDropdown}>
//           {loading ? (
//             <div className={styles.loadingSpinner}>Loading...</div>
//           ) : (
//             <select
//               value={selectedTerm}
//               onChange={handleTermChange}
//               disabled={isQuiz} // 如果是 Quiz 模式，禁用下拉框
//             >
//               {termOptions.map((option) => (
//                 <option
//                   key={option.value}
//                   value={option.value}
//                   style={{
//                     backgroundColor:
//                       option.value === selectedTerm
//                         ? "#647842" // 已选项背景色
//                         : "#ccc", // 灰色背景表示禁用的选项
//                     color: option.value === selectedTerm ? "white" : "black",
//                   }}
//                   disabled={isQuiz && option.value !== selectedTerm} // 禁用非选中的选项
//                 >
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         <h2>Welcome, {username}</h2>

//         <div className={styles.toggleSwitch}>
//           <span
//             className={`${styles.switchOption} ${!isQuiz ? styles.active : ""}`}
//             onClick={handleSwitch}
//           >
//             Practice
//           </span>
//           <span
//             className={`${styles.switchOption} ${isQuiz ? styles.active : ""}`}
//             onClick={handleSwitch}
//           >
//             Quiz
//           </span>
//         </div>

//         {isQuiz ? (
//           <div className={styles.quizCarousel}>
//             <Slider {...sliderSettings}>
//               <div
//                 className={styles.carouselItem}
//                 onClick={handleTrueOrFalseQuiz}
//               >
//                 <img
//                   src={quiztrueorfalseIcon}
//                   alt="True/False Icon"
//                   className={styles.fullSizeImage}
//                 />
//               </div>
//               <div
//                 className={styles.carouselItem}
//                 onClick={handleSingleChoiceQuiz}
//               >
//                 <img
//                   src={quizsingleIcon}
//                   alt="Single-choice Icon"
//                   className={styles.fullSizeImage}
//                 />
//               </div>

//               <div
//                 className={styles.carouselItem}
//                 onClick={handleBlankFillingQuiz}
//               >
//                 <img
//                   src={quizblankIcon}
//                   alt="Blank Filling Icon"
//                   className={styles.fullSizeImage}
//                 />
//               </div>
//             </Slider>
//           </div>
//         ) : (
//           <div className={styles.practiceCarousel}>
//             <div
//               className={styles.practiceItem}
//               onClick={handleTrainWithAllPlants}
//             >
//               <img
//                 src={quizpracticeIcon}
//                 alt="Practice Icon"
//                 className={styles.fullSizeImage}
//               />
//             </div>
//           </div>
//         )}

//         <div className={styles.bottomNav}>
//           <button className={styles.navButton} onClick={() => navigate("/")}>
//             <i className="fas fa-home"></i>
//           </button>
//           <button
//             className={styles.navButton}
//             onClick={() => navigate("/LoggedHome/LeaderBoard")}
//           >
//             <i className="fas fa-trophy"></i>
//           </button>
//           <button
//             className={styles.navButton}
//             onClick={() => navigate("/LoggedHome/PersonalProfile")}
//           >
//             <i className="fas fa-user-circle"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoggedHome;

// new version with axios
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import quizblankIcon from "../assets/FillingBlankQueIcon.png";
import quizsingleIcon from "../assets/SingleChoiceQueIcon.png";
import quiztrueorfalseIcon from "../assets/TrueFalseQueIcon.png";
import quizpracticeIcon from "../assets/TrainWithAllPlantIcon.png";

import styles from "../styles/LoggedHome.module.css";
import backendUrl from "../config";

const LoggedHome = () => {
  const termOptions = [
    { value: "2110101", label: "LASC 211 S1, Test 1" },
    { value: "2110102", label: "LASC 211 S1, Test 2" },
    { value: "206201", label: "LASC 206 S2, Test 1" },
    { value: "206202", label: "LASC 206 S2, Test 2" },
  ];

  const [isQuiz, setIsQuiz] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0].value);
  const [loading, setLoading] = useState(false); 
  const [username, setUsername] = useState("Guest");
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    fetchDataByTerm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTerm]);

  const handleSwitch = () => {
    setIsQuiz(!isQuiz);
  };

  const handleTermChange = async (event) => {
    setLoading(true); // begin loading
    setSelectedTerm(event.target.value);
    try {
      await fetchDataByTerm();
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const fetchDataByTerm = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Access token not found. Please log in again.");
      setUsername("Guest");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/admin/logged_home`, {
        params: { term: selectedTerm },
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(
        response.data.map((item, index) => ({
          ...item,
          id: item.QuestionID,
          index: index + 1,
        }))
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching data. Please try again."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  const handleTrainWithAllPlants = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/quizzes/quizzetest/train-questions`,
        {
          params: { term: selectedTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      navigate("/LoggedHome/Train-with-allPlants", {
        state: { questions: data },
      });
    } catch (error) {
      console.error("Error fetching training questions:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching training questions. Please try again.";
      alert(`Failed to fetch training questions: ${errorMessage}`);
    }
  };

  const handleSingleChoiceQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/single-choice-quizzes/single-choice`,
        {
          params: { term: selectedTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      navigate("/LoggedHome/Single-Choice-Quiz", {
        state: { questions: data },
      });
    } catch (error) {
      console.error("Error fetching single-choice questions:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching single-choice questions. Please try again.";
      alert(`Failed to fetch single-choice questions: ${errorMessage}`);
    }
  };

  const handleBlankFillingQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/blank-filling-quizzes/blank-filling-quizzes`,
        {
          params: { term: selectedTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      navigate("/LoggedHome/Blank-Filling-Quiz", {
        state: { questions: data },
      });
    } catch (error) {
      console.error("Error fetching blank-filling questions:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching blank-filling questions. Please try again.";
      alert(`Failed to fetch blank-filling questions: ${errorMessage}`);
    }
  };

  const handleTrueOrFalseQuiz = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/true-false/get-true-false-questions`,
        {
          params: { term: selectedTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      navigate("/LoggedHome/True-Or-False-Quiz", {
        state: { questions: data },
      });
    } catch (error) {
      console.error("Error fetching true-or-false questions:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching true-or-false questions. Please try again.";
      alert(`Failed to fetch true-or-false questions: ${errorMessage}`);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    term: termOptions[0].value, // init to be first term option value
    questionContent: "What's my botanical name?",
    correctAnswer: "",
    plantImage: null,
  });

  const handleImageClick = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
  };

  const handleEditClick = (index) => {
    setEditMode(true);
    setCurrentEditingIndex(index);
    setCurrentItem(data[index]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImageSrc("");
    }
  };

  const handleSave = async () => {
    if (!selectedImageFile) {
      alert("Please select an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImageFile);
    const itemId = currentItem.id;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Access token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/update_image/${itemId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedData = [...data];
      updatedData[currentEditingIndex].PlantImages = `${response.data.new_plant_image_url}?t=${new Date().getTime()}`;
      setData(updatedData);
      resetEditState();
    } catch (error) {
      console.error("Error updating image:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the image. Please try again.";
      alert(errorMessage);
    }
  };

  const resetEditState = () => {
    setEditMode(false);
    setCurrentEditingIndex(null);
    setCurrentItem(null);
    setSelectedImageFile(null);
    setPreviewImageSrc("");
  };

  const handleCancel = resetEditState;

  const handleDeleteClick = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    const itemId = data[index].id;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Access token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete_question/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message || "Question deleted successfully.");
      setData(data.filter((_, idx) => idx !== index));
    } catch (error) {
      console.error("Error deleting question:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the item. Please try again.";
      alert(errorMessage);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewQuestion = async () => {
    // valiate if user fill required fields
    if (!newQuestion.correctAnswer.trim()) {
      alert("Please enter the plant name.");
      return;
    }

    const formData = new FormData();
    formData.append("term", newQuestion.term);
    formData.append("questionContent", newQuestion.questionContent);
    formData.append("correctAnswer", newQuestion.correctAnswer);
    // only if user selected an image, add it to formData
    if (newQuestion.plantImage) {
      formData.append("image", newQuestion.plantImage);
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Access token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/add_question`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        setIsAddModalOpen(false);
        // reset newQuestion state
        setNewQuestion({
          term: termOptions[0].value,
          questionContent: "What’s my botanical name?",
          correctAnswer: "",
          plantImage: null,
        });
        fetchDataByTerm(); // reloading data
      } else {
        setError(response.data.message || "Failed to add new question.");
      }
    } catch (error) {
      console.error("Error adding new question:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add new question. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
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
              disabled={isQuiz} // if is Quiz mode,ban dropdown
            >
              {termOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{
                    backgroundColor:
                      option.value === selectedTerm
                        ? "#647842" 
                        : "#ccc", 
                    color: option.value === selectedTerm ? "white" : "black",
                  }}
                  disabled={isQuiz && option.value !== selectedTerm} 
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <h2>Welcome, {username}</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}

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
              <div
                className={styles.carouselItem}
                onClick={handleTrueOrFalseQuiz}
              >
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

        {/* Modal for Enlarged Image */}
        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImageSrc}
                alt="Enlarged Plant"
                className={styles.modalImage}
              />
            </div>
          </div>
        )}

        {/* Modal for Editing Image */}
        {editMode && currentItem && (
          <div className={styles.modal} onClick={handleCancel}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.imagePreview}>
                <img
                  src={`${backendUrl}/static/plantPic/${currentItem.PlantImages}`}
                  alt="Current Plant"
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.itemInfo}>
                <p>Name: {currentItem.CorrectAnswer}</p>
              </div>
              <div className={styles.newImageUpload}>
                <p>Select New Image:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImageSrc && (
                  <div className={styles.imagePreview}>
                    <p>New Image Preview:</p>
                    <img
                      src={previewImageSrc}
                      alt="New Plant Preview"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button onClick={handleSave} className={styles.saveButton}>
                  Save
                </button>
                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding New Question */}
        {isAddModalOpen && (
          <div
            className={styles.modal}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.formGroup}>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    marginBottom: "5px",
                  }}
                >
                  Add New Plant
                </p>

                <select
                  className={styles.inputField}
                  value={newQuestion.term}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, term: e.target.value })
                  }
                >
                  {termOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.inputField}
                  value={newQuestion.questionContent}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionContent: e.target.value,
                    })
                  }
                >
                  <option value="What's my botanical name?">
                    What's my botanical name?
                  </option>
                  <option value="What's my common name?">
                    What's my common name?
                  </option>
                </select>

                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Plant Name"
                  value={newQuestion.correctAnswer}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                />
                <input
                  className={styles.inputFile}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      plantImage: e.target.files[0],
                    })
                  }
                />

                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleAddNewQuestion}
                    className={styles.addButton}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className={styles.bottomNav}>
          <button className={styles.navButton} onClick={() => navigate("/")}>
            <i className="fas fa-home"></i>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate("/LoggedHome/LeaderBoard")}
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


