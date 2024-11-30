import React, {useState} from "react";
import { login } from '../../api/auth/authService';
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import "./auth.css";
import PropTypes from "prop-types";

const Login = ({onLoginSuccess}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const response = await login(username, password);
      localStorage.setItem('jwtToken', response.token);
      
      onLoginSuccess();
      navigate("/home");
    } catch (err) {
      setError("Invalid username or password. Please try again");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Please login to your account</p>
        
        {error && <div className="error-block">{error}</div>}
        {loading && <Spinner/>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn-primary">Login</button>
        </form>
        
        <p className="auth-footer">
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;