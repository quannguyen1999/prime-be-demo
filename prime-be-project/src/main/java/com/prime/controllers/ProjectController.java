package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectOverallStatisticsResponse;
import com.prime.models.response.ProjectResponse;
import com.prime.models.response.ProjectStatisticsResponse;
import com.prime.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for managing project-related operations in the system.
 */
@RestController
@RequestMapping(value = PathApi.PROJECT)
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Creates a new project in the system.
     * 
     * @param projectRequest The request body containing project details including:
     *                       - name: The name of the project
     *                       - description: Detailed description of the project
     * @return ResponseEntity containing the created project details with HTTP 201 (Created) status
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest projectRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(projectRequest));
    }

    /**
     * Retrieves a paginated list of projects with optional filtering.
     * 
     * @param page The page number (zero-based index)
     * @param size The number of items per page
     * @param name Optional search term to filter projects by name
     * @return ResponseEntity containing a paginated list of projects with HTTP 200 (OK) status
     */
    @GetMapping
    public ResponseEntity<CommonPageInfo<ProjectResponse>> getListProject(@RequestParam Integer page, @RequestParam Integer size, String name) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.listProject(page, size, name));
    }

    /**
     * Updates an existing project with new information.
     * @param projectRequest The request body containing updated project details
     * @param projectId The UUID of the project to be updated
     * @return ResponseEntity containing the updated project details with HTTP 200 (OK) status
     */
    @PutMapping
    public ResponseEntity<ProjectResponse> updateProject(@RequestBody ProjectRequest projectRequest, @RequestParam UUID projectId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.updateProject(projectRequest, projectId));
    }

    /**
     * Deletes a project from the system.
     * @param projectId The UUID of the project to be deleted
     * @return ResponseEntity with HTTP 200 (OK) status
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteProject(@RequestParam UUID projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * Retrieves detailed information about a specific project.
     * 
     * @param projectId The UUID of the project to retrieve
     * @return ResponseEntity containing the project details with HTTP 200 (OK) status
     */
    @GetMapping(value = PathApi.GET_PROJECT_BY_ID)
    public ResponseEntity<ProjectResponse> getProjectById(@RequestParam UUID projectId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getProjectById(projectId));
    }

    /**
     * Retrieves statistics for all projects in the system.
     * 
     * @return ResponseEntity containing project statistics with HTTP 200 (OK) status
     */
    @GetMapping(value = PathApi.GET_PROJECT_STATISTICS)
    public ResponseEntity<ProjectStatisticsResponse> getProjectStatistics() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getProjectStatistics());
    }

    /**
     * Retrieves overall project statistics and analytics.
     * 
     * @return ResponseEntity containing overall project statistics with HTTP 200 (OK) status
     */
    @GetMapping(value = PathApi.GET_PROJECT_OVERALL)
    public ResponseEntity<ProjectOverallStatisticsResponse> getProjectOverallStatistics() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getProjectOverallStatistics());
    }
}
