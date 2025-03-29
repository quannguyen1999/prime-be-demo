package com.prime.service;

import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(TaskRequest taskRequest);

    List<TaskResponse> listTask(Integer page, Integer size);

    void deleteTask(UUID taskId);

    TaskResponse updateTask(TaskRequest taskRequest, UUID taskId);

}
