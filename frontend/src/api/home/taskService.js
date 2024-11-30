import axios from "../axiosInstance";

export const createTask = async (taskDto) => {
    const response = await axios.post('/task/', taskDto);
    return response.data;
};
  
export const deleteTask = async (taskId) => {
    const response = await axios.delete(`/task/${taskId}`);
    return response.data;
};

export const updateTask = async (taskId, taskDto) => {
    const response = await axios.put(`/task/${taskId}`, taskDto);
    return response.data;
};

export const getTasks = async (filterParams = {}) => {
    const response = await axios.get('/task/', { params: filterParams });
    return response.data;
};