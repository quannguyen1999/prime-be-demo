package com.prime.service;

import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;

import java.util.UUID;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest projectRequest);

    CommonPageInfo<ProjectResponse> listProject(Integer page, Integer size, String name);

    void deleteProject(UUID projectId);

    ProjectResponse updateProject(ProjectRequest projectRequest, UUID projectId);

}
