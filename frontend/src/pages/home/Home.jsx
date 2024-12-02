import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { logout } from "../../api/auth/authService";
import { useNavigate } from "react-router-dom";
import { createTask, getTasks, updateTask, deleteTask } from "../../api/home/taskService";
import "./home.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddTaskModal from "./AddTaskModal";
import TaskDto from "../../api/home/taskDto";

const Home = ({onLogoutSuccess}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    completed: null,
    finishDate: null,
    title: null,
    sortBy: null,
    sortDirection: null
  });

  const fetchTasks = useCallback(async () => {
      try {
        const tasks = await getTasks(filters);
        setTasks(tasks);
      } catch (error) {
        setError(error)
      }
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
  };

  const handleLogout = () => {
    logout();
    onLogoutSuccess();
    navigate("/");
  };

  const executeTaskAction = async (action) => {
    try {
      await action();
      fetchTasks();
    } catch (e) {
      setError(e);
    }
  };

  const handleAddTask = (taskDto) => executeTaskAction(() => createTask(taskDto));
  const handleUpdateTask = (taskId, taskDto) => executeTaskAction(() => updateTask(taskId, taskDto));
  const handleCompleteTask = (task) => {
    const dto = TaskDto(task.title, task.description, task.finishDate, true);
    executeTaskAction(() => updateTask(task.id, dto));
  };
  const handleDeleteTask = (taskId) => executeTaskAction(() => deleteTask(taskId));

  const handleSortDirectionChange = () => {
    if (filters.sortDirection === "asc") {
      setFilters({ ...filters, sortDirection: "desc" });
    } else {
      setFilters({ ...filters, sortDirection: "asc" });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const getJwtToken = () => {
      const token = localStorage.getItem("jwtToken");
      
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
        } catch (error) {
          setError(error)
        }
      }
    };
    getJwtToken();
  }, []);
  
  return (
    <div className="background-container">
      <div className="dashboard-container">
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={initialData ? handleUpdateTask : handleAddTask}
          initialData={initialData}
        />
        <div className="top-bar">
          <div className="user-bar">
            <h1 className="welcome-message">{username}</h1>
            <button
              className="logout-btn"
              onClick={(e) => {
                e.stopPropagation();
                    handleLogout();
                }}
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i>
            </button>
          </div>
          <div className="filters">
            <button className="add-task-btn" onClick={() => {
                setInitialData(null);
                setIsModalOpen(true);
            }}>
                Create task
            </button>
            <select name="completed" onChange={handleFilterChange} value={filters.completed}>
                <option value="">All Status</option>
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
            </select>

            <input
                type="date"
                name="finishDate"
                onChange={handleFilterChange}
                value={filters.finishDate}
            />

            <input
                type="text"
                placeholder="Search by title"
                name="title"
                onChange={handleFilterChange}
                value={filters.title}
            />
            <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
                <option value="">Sort by</option>
                <option value="createdAt">Creation Date</option>
                <option value="finishDate">Finish Date</option>
            </select>
            <button className="sort-direction" onClick={handleSortDirectionChange}>
              <i className={filters.sortDirection === 'asc' ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down"}/>
            </button>
            {error && <div className="error-block">{error}</div>}
          </div>
        </div>
          
        <div className="task-grid-container">
          <div className="task-grid">
            {tasks?.map((task) => (
              <button
                  className={`task-card ${task.completed ? 'completed' : 'not-completed'}`}
                  key={task.id}
                  onClick={() => {
                      setInitialData(task);
                      setIsModalOpen(true);
                  }}
              >
                <div className="task-card-header">
                    <h3 className={`status ${task.completed ? 'completed' : 'not-completed'}`} title={task.title}>{task.title}</h3>
                    <div className="action-buttons">
                      <button
                          className="delete-btn"
                          onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }
                          }}
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                      {!task.completed && (
                        <button
                          className="check-btn"
                          onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteTask(task);
                          }}
                        >
                          <i className="fa fa-check" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                </div>
                <p className="description" title={task.description}>{task.description}</p>
                <p className="date">Deadline {new Date(task.finishDate).toLocaleDateString('ru-ru')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  onLogoutSuccess: PropTypes.func.isRequired,
};

export default Home;