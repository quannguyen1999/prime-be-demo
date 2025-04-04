package com.prime.service.impl;

import com.prime.annotations.Audited;
import com.prime.constants.ActivityType;
import com.prime.constants.MessageErrors;
import com.prime.constants.TaskStatus;
import com.prime.entities.Project;
import com.prime.entities.Task;
import com.prime.exceptions.BadRequestException;
import com.prime.feignClient.UserServiceClient;
import com.prime.mappers.TaskMapper;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.models.response.UserResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.repositories.TaskRepository;
import com.prime.service.TaskService;
import com.prime.service.WebSocketService;
import com.prime.utils.SecurityUtil;
import com.prime.validators.TaskValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.prime.mappers.TaskMapper.MAPPER;

@AllArgsConstructor
@Service
public class TaskImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final ProjectRepository projectRepository;

    private final TaskValidator taskValidator;

    private final UserServiceClient userServiceClient;

    private final WebSocketService webSocketService;

    @Override
    @Audited(activityType = ActivityType.TASK_CREATED, entityType = "TASK")
    public TaskResponse createTask(TaskRequest taskRequest) {
        //Validate Create task
        UserResponse userAssigned = taskValidator.validateCreate(taskRequest);
        Task task = MAPPER.taskRequestToTask(taskRequest);
        task.setAssignedTo(userAssigned.getId());
        task.setStatus(TaskStatus.BACK_LOG);

        Project project = projectRepository.findById(taskRequest.getProjectId()).get();
        task.setProject(project);

        Task taskInsert = taskRepository.save(task);
        TaskResponse taskResponse = MAPPER.taskToTaskResponse(taskInsert);
        taskResponse.setUserName(taskRequest.getAssignedTo());
        webSocketService.broadcastTaskCreation(task.getProject().getId().toString(), taskResponse);
        return taskResponse;
    }

    @Override
    public List<TaskResponse> getAllTaskByProject(UUID projectId, Boolean byMe) {
        //Validate The list task
        taskValidator.validateIdProject(projectId);
        List<Task> tasks = byMe ? taskRepository.findByProjectIdAndAssignedTo(projectId, SecurityUtil.getIDUser()) : taskRepository.findByProjectId(projectId);
        Map<UUID, String> getListUserNames = userServiceClient.getUsernameUsers(tasks.stream().map(Task::getAssignedTo).collect(Collectors.toList()));

        List<TaskResponse> taskResponse = tasks.stream()
                .map(TaskMapper.MAPPER::taskToTaskResponse).toList();

        //Map Username
        taskResponse.parallelStream().forEach(taskResponse1 -> {
            if (getListUserNames.containsKey(taskResponse1.getAssignedTo())) {
                taskResponse1.setUserName(getListUserNames.get(taskResponse1.getAssignedTo()));
            }
        });
        return taskResponse;
    }

    @Override
    public CommonPageInfo<TaskResponse> getTaskRoot(Integer page, Integer size, String nameTask) {
        //Validate The list task
        taskValidator.validateGetList(page, size);

        //Find Data
        Page<Task> tasks = null;
        if (SecurityUtil.isAdmin()) {
            tasks = StringUtils.hasLength(nameTask) ? taskRepository.searchTasks(nameTask, PageRequest.of(page, size)) :
                    taskRepository.findAll(PageRequest.of(page, size));
        } else {
            tasks = StringUtils.hasLength(nameTask) ? taskRepository.searchTasksByAssignIdUser(SecurityUtil.getIDUser(), PageRequest.of(page, size)) :
                    taskRepository.searchTaskByKeyWordAndAssignIdUser(nameTask, SecurityUtil.getIDUser(), PageRequest.of(page, size));
        }
        CommonPageInfo<TaskResponse> taskResponse = CommonPageInfo.<TaskResponse>builder()
                .total(tasks.getTotalElements())
                .page(tasks.getNumber())
                .size(tasks.getSize())
                .data(tasks.getContent().stream().map(MAPPER::taskToTaskResponse).collect(Collectors.toList()))
                .build();

        Map<UUID, String> getListUserNames = userServiceClient.getUsernameUsers(tasks.getContent().stream().map(Task::getAssignedTo).collect(Collectors.toList()));
        taskResponse.getData().parallelStream().forEach(taskResponse1 -> {
            if (getListUserNames.containsKey(taskResponse1.getAssignedTo())) {
                taskResponse1.setUserName(getListUserNames.get(taskResponse1.getAssignedTo()));
            }
        });
        return taskResponse;
    }

    @Override
    @Audited(activityType = ActivityType.TASK_DELETED, entityType = "TASK")
    public void deleteTask(UUID taskId) {
        //Validate the delete task
        taskValidator.validateDeleteTask(taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BadRequestException(MessageErrors.TASK_INVALID));
        String projectId = task.getProject().getId().toString();
        taskRepository.deleteById(taskId);
        webSocketService.broadcastTaskDeletion(projectId, taskId.toString());
    }

    @Override
    @Audited(activityType = ActivityType.TASK_UPDATED, entityType = "TASK")
    public TaskResponse updateTask(TaskRequest taskRequest, UUID taskId) {
        //Validate the delete task
        UserResponse userResponse = taskValidator.validateUpdate(taskRequest, taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BadRequestException(MessageErrors.TASK_INVALID));
        if (StringUtils.hasLength(taskRequest.getTitle())) {
            task.setTitle(taskRequest.getTitle());
        }
        if (StringUtils.hasLength(taskRequest.getDescription())) {
            task.setDescription(taskRequest.getDescription());
        }
        if (!ObjectUtils.isEmpty(taskRequest.getStatus())) {
            task.setStatus(taskRequest.getStatus());
        }
        if (SecurityUtil.isAdmin() && !ObjectUtils.isEmpty(userResponse)) {
            task.setAssignedTo(userResponse.getId());
        }
        task = taskRepository.save(task);
        TaskResponse response = TaskMapper.MAPPER.taskToTaskResponse(task);
        webSocketService.broadcastTaskUpdate(task.getProject().getId().toString(), response);
        return response;
    }

    @Override
    @Audited(activityType = ActivityType.TASK_STATUS_CHANGED, entityType = "TASK")
    public TaskResponse updateTaskStatus(UUID id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(MessageErrors.TASK_INVALID));
        task.setStatus(status);
        task = taskRepository.save(task);
        TaskResponse response = TaskMapper.MAPPER.taskToTaskResponse(task);
        webSocketService.broadcastTaskUpdate(task.getProject().getId().toString(), response);
        return response;
    }

    @Override
    @Audited(activityType = ActivityType.TASK_ASSIGNED, entityType = "TASK")
    public TaskResponse assignTask(UUID id, UUID userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(MessageErrors.TASK_INVALID));
        task.setAssignedTo(userId);
        task = taskRepository.save(task);
        TaskResponse response = TaskMapper.MAPPER.taskToTaskResponse(task);
        webSocketService.broadcastTaskUpdate(task.getProject().getId().toString(), response);
        return response;
    }
}
