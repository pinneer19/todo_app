import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/home/Home";
import checkTokenExpiration from "./util/checkTokenExpiration";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwtToken');
      if (token && checkTokenExpiration(token)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken')
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home"/> : <Navigate to="/login"/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)}/>} />
        <Route path="/home" element={isAuthenticated ? <Home onLogoutSuccess={() => setIsAuthenticated(false)} /> : <Navigate to="/"/>} />
      </Routes>
    </Router>
  );
}

export default App;