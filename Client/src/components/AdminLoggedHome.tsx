// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "../styles/AdminLoggedHome.module.css";
// import backendUrl from "../config";
// import axios from "axios";
// const AdminLoggedHome = () => {
//   const termOptions = [
//     { value: "2110101", label: "LASC 211 S1, Test 1" },
//     { value: "2110102", label: "LASC 211 S1, Test 2" },
//     { value: "206201", label: "LASC 206 S2, Test 1" },
//     { value: "206202", label: "LASC 206 S2, Test 2" },
//   ];

//   const [selectedTerm, setSelectedTerm] = useState(termOptions[0].value);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalImageSrc, setModalImageSrc] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [selectedImageFile, setSelectedImageFile] = useState(null);
//   const [previewImageSrc, setPreviewImageSrc] = useState("");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newQuestion, setNewQuestion] = useState({
//     term: '',
//     questionContent: 'What’s my botanical name?',
//     correctAnswer: '',
//     plantImage: null
//   });

//   const username = localStorage.getItem("username") || "Admin";
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDataByTerm();
//   }, [selectedTerm]);

//   const handleTermChange = (event) => {
//     setSelectedTerm(event.target.value);
//   };

//   const fetchDataByTerm = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("Access token not found. Please log in again.");
//       setData([]);
//       return;
//     }

//     setLoading(true);
//     try {
//         //`${backendUrl}/api/score/submit`

//       const response = await fetch(`${backendUrl}/api/admin/logged_home?term=${selectedTerm}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         mode: "cors",
//         credentials: "include",
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setData(result.map((item, index) => ({ ...item, id: item.QuestionID, index: index + 1 })));
//         setError(null);
//       } else {
//         setError(result.message || "Failed to load data.");
//         setData([]);
//       }
//     } catch (error) {
//       setError("An error occurred while fetching data. Please try again.");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageClick = (src) => {
//     setModalImageSrc(src);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalImageSrc("");
//   };

//   const handleEditClick = (index) => {
//     setEditMode(true);
//     setCurrentEditingIndex(index);
//     setCurrentItem(data[index]);
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedImageFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImageSrc(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImageSrc("");
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedImageFile) {
//       alert("Please select an image file.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("image", selectedImageFile);
//     const itemId = currentItem.id;

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Access token not found. Please log in again.");
//       return;
//     }

//     try {
//          //`${backendUrl}/api/score/submit`
//       const response = await fetch(`${backendUrl}/api/admin/update_image/${itemId}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });
//       const result = await response.json();
//       if (response.ok) {
//         const updatedData = [...data];
//         updatedData[currentEditingIndex].PlantImages = result.newImagePath.split('/').pop();
//         setData(updatedData);
//         resetEditState();
//       } else {
//         alert(result.message || "Failed to update image.");
//       }
//     } catch (error) {
//       alert("An error occurred while updating the image. Please try again.");
//     }
//   };

//   const resetEditState = () => {
//     setEditMode(false);
//     setCurrentEditingIndex(null);
//     setCurrentItem(null);
//     setSelectedImageFile(null);
//     setPreviewImageSrc("");
//   };

//   const handleCancel = resetEditState;

//   const handleDeleteClick = async (index) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (!confirmDelete) return;

//     const itemId = data[index].id;

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Access token not found. Please log in again.");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/admin/update_image/${itemId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setData(data.filter((_, idx) => idx !== index));
//       } else {
//         alert(result.message || "Failed to delete item.");
//       }
//     } catch (error) {
//       alert("An error occurred while deleting the item. Please try again.");
//     }
//   };

//   const handleAddClick = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleAddNewQuestion = async () => {
//     const formData = new FormData();
//     formData.append('term', newQuestion.term);
//     formData.append('questionContent', newQuestion.questionContent);
//     formData.append('correctAnswer', newQuestion.correctAnswer);
//     formData.append('image', newQuestion.plantImage);

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Access token not found. Please log in again.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/AdminLoggedHome/AddQuestion`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         body: formData
//       });
//       if (response.ok) {
//         setIsAddModalOpen(false);
//         fetchDataByTerm();  // Reload the data
//       } else {
//         const result = await response.json();
//         setError(result.message);
//       }
//     } catch (error) {
//       setError("Failed to add new question: " + error.message);
//     }
//   };

//   return (
//     <div className={styles.homepageHomeContainer}>
//       <div className={styles.homepageInnerContainer}>
//         <div className={styles.quizDropdown}>
//           <select value={selectedTerm} onChange={handleTermChange}>
//             {termOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           <button onClick={handleAddClick} className={styles.addButton}>Add New Question</button>
//         </div>

//         <h2>Welcome, {username}</h2>
//         {loading ? (
//           <div className={styles.loadingSpinner}>Loading...</div>
//         ) : error ? (
//           <div className={styles.errorMessage}>{error}</div>
//         ) : (
//           <div className={styles.dataContainer}>
//             {data.length === 0 ? (
//               <p>No data available for this term.</p>
//             ) : (
//               <ul className={styles.dataList}>
//                 {data.map((item, index) => (
//                   <li key={item.id} className={styles.dataItem}>
//                     <p className={styles.correctAnswer}>{item.CorrectAnswer}</p>
//                     <img
//                       src={`src/assets/plantPic/${item.PlantImages}.png`}
//                       alt={item.CorrectAnswer}
//                       className={styles.dataImage}
//                       onClick={() => handleImageClick(`src/assets/plantPic/${item.PlantImages}.png`)}
//                     />
//                     <div className={styles.buttonGroup}>
//                       <button onClick={() => handleEditClick(index)} className={styles.editButton}>Edit</button>
//                       <button onClick={() => handleDeleteClick(index)} className={styles.deleteButton}>Delete</button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {isModalOpen && (
//           <div className={styles.modal} onClick={closeModal}>
//             <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//               <img src={modalImageSrc} alt="Enlarged Plant" className={styles.modalImage} />
//             </div>
//           </div>
//         )}

//         {editMode && currentItem && (
//           <div className={styles.modal} onClick={handleCancel}>
//             <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//               <div className={styles.imagePreview}>
//                 <img src={`src/assets/plantPic/${currentItem.PlantImages}.png`} alt="Current Plant" className={styles.previewImage} />
//               </div>
//               <div className={styles.itemInfo}>
//                 <p>Name: {currentItem.CorrectAnswer}</p>
//               </div>
//               <div className={styles.newImageUpload}>
//                 <p>Select New Image:</p>
//                 <input type="file" accept="image/*" onChange={handleFileChange} />
//                 {previewImageSrc && (
//                   <div className={styles.imagePreview}>
//                     <p>New Image Preview:</p>
//                     <img src={previewImageSrc} alt="New Plant Preview" className={styles.previewImage} />
//                   </div>
//                 )}
//               </div>
//               <div className={styles.modalButtons}>
//                 <button onClick={handleSave} className={styles.saveButton}>Save</button>
//                 <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}

// {isAddModalOpen && (
//   <div className={styles.modal} onClick={() => setIsAddModalOpen(false)}>
//     <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

//       <div className={styles.formGroup}>
//       <p style={{
//   fontSize: '22px',
//   fontWeight: 'bold',
//   textAlign: 'center',
//   padding: '5px',
//   marginBottom: '5px'
// }}>Add New Plant</p>

//         <select
//           className={styles.inputField}
//           value={newQuestion.term}
//           onChange={(e) => setNewQuestion({ ...newQuestion, term: e.target.value })}
//         >
//           {termOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>

//         <select
//           className={styles.inputField}
//           value={newQuestion.questionContent}
//           onChange={(e) => setNewQuestion({ ...newQuestion, questionContent: e.target.value })}
//         >
//           <option value="What’s my botanical name?">What’s my botanical name?</option>
//           <option value="What’s my common name?">What’s my common name?</option>
//         </select>

//         <input
//           className={styles.inputField}
//           type="text"
//           placeholder="Plant Name"
//           value={newQuestion.correctAnswer}
//           onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
//         />
//         <input
//           className={styles.inputFile}
//           type="file"
//           accept="image/*"
//           onChange={(e) => setNewQuestion({ ...newQuestion, plantImage: e.target.files[0] })}
//         />

//         <div className={styles.buttonGroup}>
//           <button onClick={handleAddNewQuestion} className={styles.addButton}>Add</button>
//           <button onClick={() => setIsAddModalOpen(false)} className={styles.cancelButton}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//         <div className={styles.bottomNav}>
//           <button className={styles.navButton} onClick={() => navigate("/")}>
//             <i className="fas fa-home"></i>
//           </button>
//           <button
//             className={styles.navButton}
//             onClick={() => navigate("/AdminLoggedHome/Profile")}
//           >
//             <i className="fas fa-user-circle"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLoggedHome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/AdminLoggedHome.module.css";
import backendUrl from "../config";

const AdminLoggedHome = () => {
  const termOptions = [
    { value: "2110101", label: "LASC 211 S1, Test 1" },
    { value: "2110102", label: "LASC 211 S1, Test 2" },
    { value: "206201", label: "LASC 206 S2, Test 1" },
    { value: "206202", label: "LASC 206 S2, Test 2" },
  ];

  const [selectedTerm, setSelectedTerm] = useState(termOptions[0].value);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    term: termOptions[0].value, //init first term option
    questionContent: "What's my botanical name?",
    correctAnswer: "",
    plantImage: null,
  });

  const username = localStorage.getItem("username") || "Admin";
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataByTerm();
  }, [selectedTerm]);

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  const fetchDataByTerm = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Access token not found. Please log in again.");
      setData([]);
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
    } catch (error) {
      setError("An error occurred while fetching data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

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
      updatedData[currentEditingIndex].PlantImages =
        response.data.new_plant_image_url.split("/").pop();
      setData(updatedData);
      resetEditState();
    } catch (error) {
      alert("An error occurred while updating the image. Please try again.");
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
      await axios.delete(`${backendUrl}/api/admin/delete_question/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((_, idx) => idx !== index));
    } catch (error) {
      alert("An error occurred while deleting the item. Please try again.");
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewQuestion = async () => {
    // validate if user filled required fields
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
     // set confirm state code 201
      if (response.status === 201) {
        // reset newQuestion state
        setIsAddModalOpen(false);
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
      setError(
        "Failed to add new question: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className={styles.homepageHomeContainer}>
      <div className={styles.homepageInnerContainer}>
        <div className={styles.quizDropdown}>
          <select value={selectedTerm} onChange={handleTermChange}>
            {termOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={handleAddClick} className={styles.addButton}>
            Add New Question
          </button>
        </div>

        <h2>Welcome, {username}</h2>
        {loading ? (
          <div className={styles.loadingSpinner}>Loading...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.dataContainer}>
            {data.length === 0 ? (
              <p>No data available for this term.</p>
            ) : (
              <ul className={styles.dataList}>
                {data.map((item, index) => (
                  <li key={item.id} className={styles.dataItem}>
                    <p className={styles.correctAnswer}>{item.CorrectAnswer}</p>
                    <img
                      src={`src/assets/plantPic/${item.PlantImages}`}
                      alt={item.CorrectAnswer}
                      className={styles.dataImage}
                      onClick={() =>
                        handleImageClick(
                          `src/assets/plantPic/${item.PlantImages}`
                        )
                      }
                    />
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => handleEditClick(index)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${modalImageSrc}`}
                alt="Enlarged Plant"
                className={styles.modalImage}
              />
            </div>
          </div>
        )}

        {editMode && currentItem && (
          <div className={styles.modal} onClick={handleCancel}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.imagePreview}>
                <img
                  src={`src/assets/plantPic/${currentItem.PlantImages}`}
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
                  <option value="What’s my botanical name?">
                    What’s my botanical name?
                  </option>
                  <option value="What’s my common name?">
                    What’s my common name?
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

        <div className={styles.bottomNav}>
          <button className={styles.navButton} onClick={() => navigate("/")}>
            <i className="fas fa-home"></i>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate("/AdminLoggedHome/Profile")}
          >
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoggedHome;
