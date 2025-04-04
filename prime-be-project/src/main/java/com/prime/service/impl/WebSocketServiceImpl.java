package com.prime.service.impl;

import com.prime.models.response.TaskResponse;
import com.prime.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void broadcastTaskUpdate(String projectId, TaskResponse task) {
        messagingTemplate.convertAndSend(
            "/topic/projects/" + projectId + "/tasks/update",
            task
        );
    }

    @Override
    public void broadcastTaskCreation(String projectId, TaskResponse task) {
        messagingTemplate.convertAndSend(
            "/topic/projects/" + projectId + "/tasks/create",
            task
        );
    }

    @Override
    public void broadcastTaskDeletion(String projectId, String taskId) {
        messagingTemplate.convertAndSend(
            "/topic/projects/" + projectId + "/tasks/delete",
            taskId
        );
    }
} 