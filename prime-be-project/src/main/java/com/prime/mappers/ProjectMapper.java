package com.prime.mappers;

import com.prime.entities.Project;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectResponse;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Component
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ProjectMapper extends CommonMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "ownerId", source = "ownerId")
    @Mapping(target = "ownerUsername", ignore = true)
    ProjectResponse projectToProjectResponse(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "ownerId", ignore = true)
    Project projectRequestToProject(ProjectRequest projectRequest);
}
