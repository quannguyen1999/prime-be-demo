package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;
import com.prime.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing project-related operations.
 * - Provides endpoints for creating, retrieving, updating, and deleting projects.
 */
@RestController
@RequestMapping(value = PathApi.PROJECT)
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Creates a new project.
     *
     * @param projectRequest The request body containing project details.
     * @return ResponseEntity with created project details and HTTP 201 status.
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest projectRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(projectRequest));
    }

    /**
     * Retrieves a paginated list of projects.
     *
     * @param page The page number (zero-based index).
     * @param size The number of projects per page.
     * @return ResponseEntity with a list of projects and HTTP 200 status.
     */
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getListProject(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.listProject(page, size));
    }

    /**
     * Updates an existing project.
     *
     * @param projectRequest The request body with updated project details.
     * @param projectId      The UUID of the project to be updated.
     * @return ResponseEntity with updated project details and HTTP 200 status.
     */
    @PutMapping
    public ResponseEntity<ProjectResponse> updateProject(@RequestBody ProjectRequest projectRequest, @RequestParam UUID projectId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.updateProject(projectRequest, projectId));
    }

    /**
     * Deletes a project by its ID.
     *
     * @param projectId The UUID of the project to be deleted.
     * @return ResponseEntity with a success message and HTTP 200 status.
     */
    @DeleteMapping
    public ResponseEntity<String> deleteProject(@RequestParam UUID projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("Project deleted successfully.");
    }
}
