package com.prime.service;

import com.prime.constants.ActivityType;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.response.ActivityLogResponse;

public interface ActivityLogService {
    void logActivity(String userId,
                     String projectId,
                     ActivityType action);

    CommonPageInfo<ActivityLogResponse> getActivityLogsByProject(String projectId, Integer page, Integer size);

    CommonPageInfo<ActivityLogResponse> getActivityLogsByUser(String userId, Integer page, Integer size);

    CommonPageInfo<ActivityLogResponse> getActivityLogs(Integer page, Integer size);
} 