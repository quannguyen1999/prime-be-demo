package com.prime.service.impl;

import com.prime.constants.TaskStatus;
import com.prime.entities.Task;
import com.prime.mappers.TaskMapper;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.models.response.UserResponse;
import com.prime.repositories.TaskRepository;
import com.prime.service.TaskService;
import com.prime.utils.SecurityUtil;
import com.prime.validators.TaskValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.prime.mappers.TaskMapper.MAPPER;
@AllArgsConstructor
@Service
public class TaskImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final TaskValidator taskValidator;

    @Override
    public TaskResponse createTask(TaskRequest taskRequest) {
        //Validate Create task
        UserResponse userAssigned = taskValidator.validateCreate(taskRequest);
        Task task = MAPPER.taskRequestToTask(taskRequest);
        task.setAssignedTo(userAssigned.getId());
        task.setStatus(TaskStatus.BACK_LOG);
        Task taskInsert = taskRepository.save(task);
        TaskResponse taskResponse = MAPPER.taskToTaskResponse(taskInsert);
        taskResponse.setUserName(taskRequest.getAssignedTo());
        return taskResponse;
    }

    @Override
    public List<TaskResponse> listTask(UUID projectId, Boolean byMe) {
        //Validate The list task
        taskValidator.validateIdProject(projectId);
        SecurityUtil.getIDUser();
        List<Task> tasks = byMe ? taskRepository.findByProjectIdAndAssignedTo(projectId, SecurityUtil.getIDUser()) : taskRepository.findByProjectId(projectId);
        return tasks.isEmpty() ? new ArrayList<>() : tasks.stream()
                .map(TaskMapper.MAPPER::taskToTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTask(UUID taskId) {
        //Validate the delete task
        taskValidator.validateDeleteTask(taskId);
        taskRepository.deleteById(taskId);
    }

    @Override
    public TaskResponse updateTask(TaskRequest taskRequest, UUID taskId) {
        //Validate the delete task
        UserResponse userResponse = taskValidator.validateUpdate(taskRequest, taskId);
        Task task = taskRepository.findById(taskId).get();
        if (StringUtils.hasLength(taskRequest.getTitle())) {
            task.setTitle(taskRequest.getTitle());
        }
        if (StringUtils.hasLength(taskRequest.getDescription())) {
            task.setDescription(taskRequest.getDescription());
        }
        if (!ObjectUtils.isEmpty(taskRequest.getStatus())) {
            task.setStatus(taskRequest.getStatus());
        }
        if (SecurityUtil.isAdmin()) {
            task.setAssignedTo(userResponse.getId());
        }
        task = taskRepository.save(task);
        return TaskMapper.MAPPER.taskToTaskResponse(task);
    }
}
