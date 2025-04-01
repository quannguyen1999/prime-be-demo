package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing tasks.
 * Provides endpoints for creating, retrieving, updating, and deleting tasks.
 */
@RestController
@RequestMapping(value = PathApi.TASK)
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Creates a new task.
     *
     * @param taskRequest The request body containing task details.
     * @return ResponseEntity with created task details and HTTP 201 status.
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest taskRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(taskRequest));
    }

    /**
     * Retrieves a paginated list of tasks.
     *
     * @param projectId The project Id (zero-based index).
     * @return ResponseEntity with a list of tasks and HTTP 200 status.
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getListTaskByProjectId(@RequestParam UUID projectId, @RequestParam Boolean byMe) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(taskService.listTask(projectId, byMe));
    }

    /**
     * Updates an existing task.
     *
     * @param taskRequest The request body with updated task details.
     * @param taskId      The UUID of the task to be updated.
     * @return ResponseEntity with updated task details and HTTP 200 status.
     */
    @PutMapping
    public ResponseEntity<TaskResponse> updateTask(@RequestBody TaskRequest taskRequest, @RequestParam UUID taskId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(taskService.updateTask(taskRequest, taskId));
    }

    /**
     * Deletes a task by its ID.
     *
     * @param taskId The UUID of the task to be deleted.
     * @return ResponseEntity with a success message and HTTP 200 status.
     */
    @DeleteMapping
    public ResponseEntity<String> deleteTask(@RequestParam UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully.");
    }
}
