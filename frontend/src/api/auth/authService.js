import axios from "../axiosInstance";

export const login = async (username, password) => {
  const response = await axios.post('/user/login', { username, password });
  return response.data;
};
  
export const register = async (username, password) => {
  const response = await axios.post('/user/register', { username, password });
  return response.data;
};

export const logout = () => {
    localStorage.removeItem('jwtToken');
};