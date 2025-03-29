package com.prime.service.impl;

import com.prime.entities.Project;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.service.ProjectService;
import com.prime.validators.ProjectValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.prime.mappers.ProjectMapper.MAPPER;

@AllArgsConstructor
@Service
public class ProjectImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectValidator projectValidator;

    @Override
    public ProjectResponse createProject(ProjectRequest projectRequest) {
        //Validate the create project
        projectValidator.validateCreate(projectRequest);
        //Insert Project
        Project project = projectRepository.save(MAPPER.projectRequestToProject(projectRequest));
        return MAPPER.projectToProjectResponse(project);
    }

    @Override
    public List<ProjectResponse> listProject(Integer page, Integer size) {
        //Validate The list project
        projectValidator.validateGetList(page, size);
        return projectRepository.findAll(PageRequest.of(page, size))
                .stream()
                .map(MAPPER::projectToProjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProject(UUID projectId) {
        //Validate the delete project
        projectValidator.validateDelete(projectId);
        projectRepository.deleteById(projectId);
    }

    @Override
    public ProjectResponse updateProject(ProjectRequest projectRequest, UUID projectId) {
        //Validate the delete project
        projectValidator.validateUpdate(projectRequest ,projectId);

        Project project = projectRepository.findById(projectId).get();
        project.setDescription(projectRequest.getDescription());
        project.setName(projectRequest.getName());
        return MAPPER.projectToProjectResponse(project);
    }
}
