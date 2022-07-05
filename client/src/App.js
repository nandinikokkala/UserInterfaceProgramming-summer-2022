import React, { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Profile from "./pages/Profile";
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterFrom';
import NavBar from "./components/Navbar";

function App() {
  const [ showNav, setShowNav] = useState(false);
  return (
    <Router>
      <div className="App">
        {showNav && <NavBar/> }
          <Routes>
            <Route exact path="/" element={<LoginForm />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
      </div>
    </Router>
  );
}
export default App;
