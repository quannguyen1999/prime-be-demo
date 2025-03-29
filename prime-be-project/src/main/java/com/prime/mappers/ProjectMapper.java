package com.prime.mappers;

import com.prime.entities.Project;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProjectMapper extends CommonMapper {
    ProjectMapper MAPPER = Mappers.getMapper(ProjectMapper.class);

    ProjectResponse projectToProjectResponse(Project project);

    Project projectRequestToProject(ProjectRequest projectRequest);

}
