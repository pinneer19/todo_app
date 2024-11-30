package dev.ru.backend.service;

import dev.ru.backend.model.Task;
import dev.ru.backend.model.User;
import dev.ru.backend.repository.TaskRepository;
import dev.ru.backend.specification.TaskSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Task updateTask(Task updatedTask) {
        return taskRepository.save(updatedTask);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<Task> getFilteredTasks(
            User user,
            String title,
            Boolean completed,
            LocalDate finishDate,
            String sortBy,
            String sortDirection
    ) {
        Specification<Task> filters = Specification
                .where(TaskSpecification.hasTitleKeyword(title))
                .and(TaskSpecification.hasStatus(completed))
                .and(TaskSpecification.hasFinishDate(finishDate))
                .and(TaskSpecification.belongsToUser(user));

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        return taskRepository.findAll(filters, sort);
    }
}