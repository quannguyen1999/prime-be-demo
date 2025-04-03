package com.prime.service;

import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(TaskRequest taskRequest);

    List<TaskResponse> getAllTaskByProject(UUID projectID, Boolean byMe);

    CommonPageInfo<TaskResponse> getTaskRoot(Integer page, Integer size, String nameTask);

    void deleteTask(UUID taskId);

    TaskResponse updateTask(TaskRequest taskRequest, UUID taskId);

}
