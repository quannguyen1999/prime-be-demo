package com.prime.service;

import com.prime.constants.ActivityType;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.response.ActivityLogResponse;

public interface ActivityLogService {
    void logActivity(String userId,
                     String projectId,
                     ActivityType action);
    
    CommonPageInfo<ActivityLogResponse> getActivityLogs(Integer page, Integer size);
} 