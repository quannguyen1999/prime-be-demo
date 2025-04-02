package com.prime.models.response;

import com.prime.constants.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    private String id;
    private String userId;
    private String username;
    private String projectId;
    private String projectName;
    private ActivityType action;
    private Date timestamp;
} 