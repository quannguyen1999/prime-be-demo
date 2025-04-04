package com.prime.service;

import com.prime.models.response.TaskResponse;

public interface WebSocketService {
    void broadcastTaskUpdate(String projectId, TaskResponse task);
    void broadcastTaskCreation(String projectId, TaskResponse task);
    void broadcastTaskDeletion(String projectId, String taskId);
} 