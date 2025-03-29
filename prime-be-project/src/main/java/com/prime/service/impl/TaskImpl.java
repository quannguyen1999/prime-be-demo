package com.prime.service.impl;

import com.prime.entities.Task;
import com.prime.mappers.TaskMapper;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.repositories.TaskRepository;
import com.prime.service.TaskService;
import com.prime.validators.TaskValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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
        taskValidator.validateCreate(taskRequest);
        Task task = taskRepository.save(MAPPER.taskRequestToTask(taskRequest));
        return MAPPER.taskToTaskResponse(task);
    }

    @Override
    public List<TaskResponse> listTask(Integer page, Integer size) {
        //Validate The list task
        taskValidator.validateGetList(page, size);
        return taskRepository.findAll(PageRequest.of(page, size))
                .stream()
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
        taskValidator.validateUpdate(taskRequest ,taskId);
        Task task = taskRepository.findById(taskId).get();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        return TaskMapper.MAPPER.taskToTaskResponse(task);
    }
}
