package dev.ru.backend.specification;

import dev.ru.backend.model.Task;
import dev.ru.backend.model.User;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class TaskSpecification {

    private TaskSpecification() {
        // not called
    }

    public static Specification<Task> hasStatus(Boolean completed) {
        return (root, query, builder) -> {
            if (completed != null) {
                return builder.equal(root.get("completed"), completed);
            }
            return builder.conjunction();
        };
    }

    public static Specification<Task> hasFinishDate(LocalDate finishDate) {
        return (root, query, builder) -> {
            if (finishDate != null) {
                return builder.equal(root.get("finishDate"), finishDate);
            }
            return builder.conjunction();
        };
    }

    public static Specification<Task> hasTitleKeyword(String keyword) {
        return (root, query, builder) -> {
            if (keyword != null && !keyword.isEmpty()) {
                return builder.like(builder.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
            }
            return builder.conjunction();
        };
    }

    public static Specification<Task> belongsToUser(User user) {
        return (root, query, builder) -> {
            if (user != null) {
                return builder.equal(root.get("user"), user);
            }
            return builder.conjunction();
        };
    }
}