package com.prime.models.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ProjectStatisticsResponse {
    private List<TaskStatusCountResponse> statusCounts;
    private List<ProjectSummary> projectSummaries;

    @Data
    public static class ProjectSummary {
        private UUID id;
        private String name;
        private String description;
        private List<MemberSummary> members;
        private double completionPercentage;
    }

    @Data
    public static class MemberSummary {
        private UUID id;
        private String username;
        private int totalTasks;
    }
} 