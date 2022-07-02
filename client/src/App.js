import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterFrom';


function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route exact path="/" element={<LoginForm />} />
            <Route path="/profile" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
      </div>
    </Router>
  );
}
export default App;
