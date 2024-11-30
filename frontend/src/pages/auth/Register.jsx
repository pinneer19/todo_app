import React, {useState} from "react";
import { register } from "../../api/auth/authService";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import Spinner from "../../components/Spinner";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const response = await register(username, password);
      localStorage.setItem('jwtToken', response.token);
      
      navigate("/home");
    } catch (err) {
      const errors = err.response.data.errors;
      const errorMessage = errors ? errors.map(error => error.defaultMessage).join("\n") : "Error was occured. Please try again";;
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Sign up to get started</p>
        
        {error && <div className="error-block">{error}</div>}
        {loading && <Spinner/>}

        <form onSubmit={handleRegister} className="auth-form">
          <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;