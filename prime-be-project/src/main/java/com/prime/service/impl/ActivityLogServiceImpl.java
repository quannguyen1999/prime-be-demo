package com.prime.service.impl;

import com.prime.constants.ActivityType;
import com.prime.entities.ActivityLog;
import com.prime.entities.Project;
import com.prime.feignClient.UserServiceClient;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.response.ActivityLogResponse;
import com.prime.repositories.ActivityLogRepository;
import com.prime.repositories.ProjectRepository;
import com.prime.service.ActivityLogService;
import com.prime.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final ProjectRepository projectRepository;
    private final UserServiceClient userServiceClient;

    @Override
    public void logActivity(String userId,
                            String projectId,
                            ActivityType action) {
        ActivityLog activityLog = ActivityLog.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .projectId(projectId)
                .action(action)
                .build();

        activityLogRepository.save(activityLog);
    }

    @Override
    public CommonPageInfo<ActivityLogResponse> getActivityLogsByProject(String projectId, Integer page, Integer size) {
        Page<ActivityLog> activityLogs = activityLogRepository.findByProjectId(projectId, PageRequest.of(page, size));
        return buildActivityLogResponse(activityLogs);
    }

    @Override
    public CommonPageInfo<ActivityLogResponse> getActivityLogsByUser(String userId, Integer page, Integer size) {
        Page<ActivityLog> activityLogs = activityLogRepository.findByUserId(userId, PageRequest.of(page, size));
        return buildActivityLogResponse(activityLogs);
    }

    @Override
    public CommonPageInfo<ActivityLogResponse> getActivityLogs(Integer page, Integer size) {
        Page<ActivityLog> activityLogs = null;
        if (SecurityUtil.isAdmin()) {
            activityLogs = activityLogRepository.findAll(PageRequest.of(page, size));
        } else {
            activityLogs = activityLogRepository.findByUserId(SecurityUtil.getIDUser().toString(), PageRequest.of(page, size));
        }
        return buildActivityLogResponse(activityLogs);
    }

    private CommonPageInfo<ActivityLogResponse> buildActivityLogResponse(Page<ActivityLog> activityLogs) {
        List<ActivityLog> logs = activityLogs.getContent();

        // Collect unique IDs
        Set<String> userIds = new HashSet<>();
        Set<String> projectIds = new HashSet<>();

        for (ActivityLog log : logs) {
            userIds.add(log.getUserId());
            projectIds.add(log.getProjectId());
        }

        // Convert string IDs to UUIDs for related service calls
        List<UUID> userIdsAsUUID = userIds.stream()
                .map(UUID::fromString)
                .collect(Collectors.toList());
        List<UUID> projectIdsAsUUID = projectIds.stream()
                .map(UUID::fromString)
                .collect(Collectors.toList());

        // Fetch related data
        Map<UUID, String> usernamesRaw = userServiceClient.getUsernameUsers(userIdsAsUUID);
        Map<String, String> usernames = usernamesRaw.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().toString(), Map.Entry::getValue));

        Map<String, Project> projects = projectRepository.findAllById(projectIdsAsUUID)
                .stream()
                .collect(Collectors.toMap(p -> p.getId().toString(), p -> p));

        // Build responses
        List<ActivityLogResponse> responses = logs.stream()
                .map(log -> ActivityLogResponse.builder()
                        .id(log.getId())
                        .userId(log.getUserId())
                        .username(usernames.get(log.getUserId()))
                        .projectId(log.getProjectId())
                        .projectName(projects.get(log.getProjectId()).getName())
                        .action(log.getAction())
                        .timestamp(log.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return CommonPageInfo.<ActivityLogResponse>builder()
                .total(activityLogs.getTotalElements())
                .page(activityLogs.getNumber())
                .size(activityLogs.getSize())
                .data(responses)
                .build();
    }
} 