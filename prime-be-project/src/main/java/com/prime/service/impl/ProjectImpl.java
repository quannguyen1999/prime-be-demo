package com.prime.service.impl;

import com.prime.entities.Project;
import com.prime.feignClient.UserServiceClient;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.service.ProjectService;
import com.prime.utils.SecurityUtil;
import com.prime.validators.ProjectValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.prime.mappers.ProjectMapper.MAPPER;

@AllArgsConstructor
@Service
public class ProjectImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectValidator projectValidator;

    private final UserServiceClient userServiceClient;

    @Override
    public ProjectResponse createProject(ProjectRequest projectRequest) {
        //Validate the create project
        projectValidator.validateCreate(projectRequest);

        Project project = MAPPER.projectRequestToProject(projectRequest);
        project.setOwnerId(SecurityUtil.getIDUser());

        //Insert Project and convert values
        ProjectResponse response = MAPPER.projectToProjectResponse(projectRepository.save(project));
        response.setOwnerUsername(SecurityUtil.getUserName());
        return response;
    }

    @Override
    public CommonPageInfo<ProjectResponse> listProject(Integer page, Integer size, String name) {
        //Validate The list project
        projectValidator.validateGetList(page, size);
        Page<Project> projects = StringUtils.hasLength(name) ? projectRepository.searchProjects(name, PageRequest.of(page, size)) :
                projectRepository.findAll(PageRequest.of(page, size));
        CommonPageInfo<ProjectResponse> projectResponses = CommonPageInfo.<ProjectResponse>builder()
                .total(projects.getTotalElements())
                .page(projects.getNumber())
                .size(projects.getSize())
                .data(projects.getContent().stream().map(MAPPER::projectToProjectResponse).collect(Collectors.toList()))
                .build();

        Map<UUID, String> getListUserNames = userServiceClient.getUsernameUsers(projects.getContent().stream().map(Project::getOwnerId).collect(Collectors.toList()));
        projectResponses.getData().parallelStream().forEach(projectResponse -> {
            if (getListUserNames.containsKey(projectResponse.getOwnerId())) {
                projectResponse.setOwnerUsername(getListUserNames.get(projectResponse.getOwnerId()));
            }
        });
        return projectResponses;
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
        projectValidator.validateUpdate(projectRequest, projectId);

        Project project = projectRepository.findById(projectId).get();
        if (StringUtils.hasLength(projectRequest.getDescription())) {
            project.setDescription(projectRequest.getDescription());
        }
        if (StringUtils.hasLength(projectRequest.getName())) {
            project.setName(projectRequest.getName());
        }

        project = projectRepository.save(project);
        ProjectResponse projectResponse = MAPPER.projectToProjectResponse(project);
        Map<UUID, String> getListUserNames = userServiceClient.getUsernameUsers(Collections.singletonList(projectResponse.getOwnerId()));
        projectResponse.setOwnerUsername(getListUserNames.get(projectResponse.getOwnerId()));
        return projectResponse;
    }
}
