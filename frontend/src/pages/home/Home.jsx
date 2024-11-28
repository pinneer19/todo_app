import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { logout } from "../../api/auth/authService";
import { useNavigate } from "react-router-dom";

const Home = ({onLogoutSuccess}) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Failed to decode JWT token", error);
      }
    }
  }, []);

  const handleSignOut = () => {
    logout();
    onLogoutSuccess();
    navigate("/");
  };

  return (
    <div>
        <h1>Welcome Back, {username}</h1>
        <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

Home.propTypes = {
  onLogoutSuccess: PropTypes.func.isRequired,
};

export default Home;