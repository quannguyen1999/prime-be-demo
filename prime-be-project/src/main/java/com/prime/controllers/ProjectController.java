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

@RestController
@RequestMapping(value = PathApi.PROJECT)
@AllArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest projectRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(projectRequest));
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<ProjectResponse>> getListProject(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.status(HttpStatus.OK).body(projectService.listProject(page, size));
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<ProjectResponse> putProject(@RequestBody ProjectRequest projectRequest, @RequestParam UUID productId) {
        return ResponseEntity.status(HttpStatus.OK).body(projectService.updateProject(projectRequest, productId));
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteProject(@RequestParam UUID productId) {
        projectService.deleteProject(productId);
        return ResponseEntity.status(HttpStatus.OK).body(HttpStatus.OK.toString());
    }

}
