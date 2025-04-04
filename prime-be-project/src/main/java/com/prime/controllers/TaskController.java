package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.prime.constants.PathApi.GET_TASK_BY_PROJECT;
import static com.prime.constants.PathApi.GET_TASK_ROOT;

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
     * Creates a new task in the system.
     * 
     * This endpoint allows users to create a new task with specified details.
     * The task will be associated with a project and can be assigned to a user.
     * 
     * @param taskRequest The request body containing task details including:
     *                    - title: The title of the task
     *                    - description: Detailed description of the task
     *                    - projectId: The ID of the project this task belongs to
     *                    - assignedTo: The username of the user to assign the task to
     * @return ResponseEntity containing the created task details with HTTP 201 (Created) status
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest taskRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(taskRequest));
    }

    /**
     * Retrieves all tasks associated with a specific project.
     * 
     * This endpoint returns a list of tasks for a given project. It supports filtering
     * to show only tasks assigned to the current user.
     * 
     * @param projectId The UUID of the project to retrieve tasks from
     * @param byMe Optional parameter to filter tasks assigned to the current user
     * @return ResponseEntity containing a list of tasks with HTTP 200 (OK) status
     */
    @GetMapping(value = GET_TASK_BY_PROJECT)
    public ResponseEntity<List<TaskResponse>> getAllTaskByProject(@RequestParam UUID projectId, Boolean byMe) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(taskService.getAllTaskByProject(projectId, byMe));
    }

    /**
     * Retrieves a paginated list of tasks with optional filtering.
     * 
     * This endpoint provides paginated access to tasks with support for:
     * - Pagination (page and size parameters)
     * - Search by task name
     * - Different views for admin and regular users
     * 
     * @param page The page number (zero-based)
     * @param size The number of items per page
     * @param nameTask Optional search term to filter tasks by name
     * @return ResponseEntity containing a paginated list of tasks with HTTP 200 (OK) status
     */
    @GetMapping(value = GET_TASK_ROOT)
    public ResponseEntity<CommonPageInfo<TaskResponse>> getTaskRoot(@RequestParam Integer page, @RequestParam Integer size, String nameTask) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(taskService.getTaskRoot(page, size, nameTask));
    }

    /**
     * Updates an existing task with new information.
     * 
     * This endpoint allows updating various aspects of a task including:
     * - Title
     * - Description
     * - Status
     * - Assignment
     * 
     * @param taskRequest The request body containing updated task details
     * @param taskId The UUID of the task to be updated
     * @return ResponseEntity containing the updated task details with HTTP 200 (OK) status
     */
    @PutMapping
    public ResponseEntity<TaskResponse> updateTask(@RequestBody TaskRequest taskRequest, @RequestParam UUID taskId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(taskService.updateTask(taskRequest, taskId));
    }

    /**
     * Deletes a task from the system.
     * 
     * This endpoint permanently removes a task from the system.
     * Only administrators or the task's assignee can delete a task.
     * 
     * @param taskId The UUID of the task to be deleted
     * @return ResponseEntity with a success message and HTTP 200 (OK) status
     */
    @DeleteMapping
    public ResponseEntity<String> deleteTask(@RequestParam UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully.");
    }
}
