import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginRegTabs from "./components/LoginRegister";
import LoggedHome from "./components/LoggedHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginRegTabs />} />
        <Route path="/LoggedHome" element={<LoggedHome />} />
      </Routes>
    </Router>
  );
}

export default App;
