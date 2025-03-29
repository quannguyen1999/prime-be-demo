package com.prime.service;

import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest projectRequest);

    List<ProjectResponse> listProject(Integer page, Integer size);

    void deleteProject(UUID projectId);

    ProjectResponse updateProject(ProjectRequest projectRequest, UUID projectId);

}
