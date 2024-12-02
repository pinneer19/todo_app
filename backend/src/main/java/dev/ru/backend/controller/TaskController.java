package dev.ru.backend.controller;

import dev.ru.backend.model.Task;
import dev.ru.backend.model.User;
import dev.ru.backend.repository.UserRepository;
import dev.ru.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @Autowired
    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping("/")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task, Principal principal) {
        var user = getCurrentUser(principal);
        task.setUser(user);

        Task result = taskService.createTask(task);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/")
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) LocalDate finishDate,
            @RequestParam(required = false, defaultValue = "finishDate") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDirection,
            Principal principal
    ) {
        User user = getCurrentUser(principal);
        List<Task> tasks = taskService.getFilteredTasks(user, title, completed, finishDate, sortBy, sortDirection);

        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable("taskId") Long taskId,
            @Valid @RequestBody Task updatedTask,
            Principal principal
    ) {
        verifyTaskOwnership(taskId, principal);

        updatedTask.setId(taskId);
        updatedTask.setUser(getCurrentUser(principal));
        updatedTask.setCreatedAt(Instant.now());

        var task = taskService.updateTask(updatedTask);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable("taskId") Long taskId, Principal principal) {
        verifyTaskOwnership(taskId, principal);
        taskService.deleteTask(taskId);

        var result = new HashMap<String, String>();
        result.put("message", "Task was deleted successfully!");

        return ResponseEntity.ok(result);
    }

    private User getCurrentUser(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return userOptional.get();
    }

    private void verifyTaskOwnership(Long taskId, Principal principal) {
        Long currentUserId = getCurrentUser(principal).getId();
        Optional<Task> task = taskService.getTaskById(taskId);

        if (task.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task with id: " + taskId + " not found");
        }

        var taskUserId = task.get().getUser().getId();
        if (!taskUserId.equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden access to task with id: " + taskId);
        }
    }
}