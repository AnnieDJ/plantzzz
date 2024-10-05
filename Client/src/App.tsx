import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginRegTabs from "./components/LoginRegister";
import LoggedHome from "./components/LoggedHome";
import PersonalProfile from "./components/PersonalProfile";
import TrainWithAllPlants from "./components/TrainWithAllPlants";
import SingleChoiceQuiz from "./components/SingleChoiceQuiz";
import BlankFillingQuiz from "./components/BlankFillingQuiz";
import TrueOrFalseQuiz from "./components/TrueOrFalseQuiz";
import AdminLoggedHome from "./components/AdminLoggedHome";
import LeaderBoard from "./components/LeaderBoard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginRegTabs />} />
        <Route path="/LoggedHome" element={<LoggedHome />} />
        <Route path="/AdminLoggedHome" element={<AdminLoggedHome />} />
        <Route path="/AdminLoggedHome/Profile" element={<PersonalProfile />} />
        <Route
          path="/LoggedHome/Train-with-allPlants"
          element={<TrainWithAllPlants />}
        />
        <Route
          path="/LoggedHome/PersonalProfile"
          element={<PersonalProfile />}
        />
      </Routes>
      <Routes>
        <Route path="/LoggedHome/LeaderBoard" element={<LeaderBoard />} />
        <Route
          path="/LoggedHome/single-choice-quiz"
          element={<SingleChoiceQuiz />}
        />
        <Route
          path="/LoggedHome/Blank-Filling-Quiz"
          element={<BlankFillingQuiz />} 
        />
        <Route
          path="/LoggedHome/True-Or-False-Quiz"
          element={<TrueOrFalseQuiz />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
