import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterFrom';
import NavBar from "./components/Navbar";


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar/>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
      </div>
    </Router>
  );
}
export default App;
