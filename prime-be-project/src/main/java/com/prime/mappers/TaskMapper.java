package com.prime.mappers;

import com.prime.entities.Task;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TaskMapper extends CommonMapper {
    TaskMapper MAPPER = Mappers.getMapper(TaskMapper.class);

    @Mapping(target = "projectName", expression = "java(task.getProject() != null ? task.getProject().getName() : null)")
    @Mapping(target = "projectId", expression = "java(task.getProject() != null ? task.getProject().getId() : null)")
    TaskResponse taskToTaskResponse(Task task);

    @Mapping(target = "assignedTo", ignore = true)
    Task taskRequestToTask(TaskRequest taskRequest);
}
