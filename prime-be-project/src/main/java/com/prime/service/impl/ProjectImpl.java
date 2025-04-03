package com.prime.service.impl;

import com.prime.annotations.Audited;
import com.prime.constants.ActivityType;
import com.prime.constants.TaskStatus;
import com.prime.entities.Project;
import com.prime.feignClient.UserServiceClient;
import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.ProjectRequest;
import com.prime.models.response.ProjectOverallStatisticsResponse;
import com.prime.models.response.ProjectResponse;
import com.prime.models.response.ProjectStatisticsResponse;
import com.prime.models.response.TaskStatusCountResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.repositories.TaskRepository;
import com.prime.service.ProjectService;
import com.prime.utils.SecurityUtil;
import com.prime.validators.ProjectValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static com.prime.mappers.ProjectMapper.MAPPER;

@AllArgsConstructor
@Service
public class ProjectImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProjectValidator projectValidator;
    private final UserServiceClient userServiceClient;

    @Override
    @Audited(activityType = ActivityType.PROJECT_CREATED, entityType = "PROJECT")
    public ProjectResponse createProject(ProjectRequest projectRequest) {
        projectValidator.validateCreate(projectRequest);
        Project project = MAPPER.projectRequestToProject(projectRequest);
        project.setOwnerId(SecurityUtil.getIDUser());
        Project projectInsert = projectRepository.save(project);
        return MAPPER.projectToProjectResponse(projectInsert);
    }

    @Override
    public CommonPageInfo<ProjectResponse> listProject(Integer page, Integer size, String name) {
        projectValidator.validateGetList(page, size);
        Page<Project> projects = StringUtils.hasLength(name) ? projectRepository.searchProjects(name, PageRequest.of(page, size)) :
                projectRepository.findAll(PageRequest.of(page, size));
        CommonPageInfo<ProjectResponse> projectResponses = CommonPageInfo.<ProjectResponse>builder()
                .total(projects.getTotalElements())
                .page(projects.getNumber())
                .size(projects.getSize())
                .data(projects.getContent().stream().map(MAPPER::projectToProjectResponse).collect(Collectors.toList()))
                .build();

        Map<UUID, String> getListUserNames = userServiceClient.getUsernameUsers(projects.getContent().stream().map(Project::getOwnerId).collect(Collectors.toList()));
        projectResponses.getData().parallelStream().forEach(projectResponse -> {
            if (getListUserNames.containsKey(projectResponse.getOwnerId())) {
                projectResponse.setOwnerUsername(getListUserNames.get(projectResponse.getOwnerId()));
            }
        });
        return projectResponses;
    }

    @Override
    @Audited(activityType = ActivityType.PROJECT_DELETED, entityType = "PROJECT")
    public void deleteProject(UUID projectId) {
        projectValidator.validateDelete(projectId);
        projectRepository.deleteById(projectId);
    }

    @Override
    @Audited(activityType = ActivityType.PROJECT_UPDATED, entityType = "PROJECT")
    public ProjectResponse updateProject(ProjectRequest projectRequest, UUID projectId) {
        projectValidator.validateUpdate(projectRequest, projectId);
        Project project = projectRepository.findById(projectId).get();
        if (projectRequest.getName() != null) {
            project.setName(projectRequest.getName());
        }
        if (projectRequest.getDescription() != null) {
            project.setDescription(projectRequest.getDescription());
        }
        project = projectRepository.save(project);
        return MAPPER.projectToProjectResponse(project);
    }

    @Override
    public List<ProjectResponse> getAllProject() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(MAPPER::projectToProjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(UUID projectId) {
        projectValidator.validateDelete(projectId);
        Project project = projectRepository.findById(projectId).get();
        return MAPPER.projectToProjectResponse(project);
    }

    @Override
    public ProjectStatisticsResponse getProjectStatistics() {
        ProjectStatisticsResponse response = new ProjectStatisticsResponse();

        // Get status counts
        List<Object[]> statusCountsRaw = taskRepository.countTasksByStatus();
        List<TaskStatusCountResponse> statusCounts = statusCountsRaw.stream()
                .map(result -> new TaskStatusCountResponse(
                        ((TaskStatus) result[0]).name(),
                        ((Number) result[1]).longValue()
                ))
                .collect(Collectors.toList());
        response.setStatusCounts(statusCounts);

        // Get all projects
        List<Project> projects = projectRepository.findAll();

        // Get task counts by project and user
        List<Object[]> taskCountsByProjectAndUser = taskRepository.countTasksByProjectAndUser();
        Map<UUID, Map<UUID, Integer>> projectUserTaskCounts = new HashMap<>();

        for (Object[] result : taskCountsByProjectAndUser) {
            UUID projectId = (UUID) result[0];
            UUID userId = (UUID) result[1];
            Integer taskCount = ((Number) result[2]).intValue();

            projectUserTaskCounts.computeIfAbsent(projectId, k -> new HashMap<>())
                    .put(userId, taskCount);
        }

        // Get project completion stats
        List<Object[]> projectCompletionStats = taskRepository.getProjectCompletionStats();
        Map<UUID, Double> projectCompletionPercentages = new HashMap<>();

        for (Object[] result : projectCompletionStats) {
            UUID projectId = (UUID) result[0];
            long totalTasks = ((Number) result[1]).longValue();
            long completedTasks = ((Number) result[2]).longValue();

            if (totalTasks > 0) {
                projectCompletionPercentages.put(projectId,
                        ((double) completedTasks / (double) totalTasks) * 100);
            }
        }

        // Get all user information
        Set<UUID> allUserIds = taskCountsByProjectAndUser.stream()
                .map(result -> (UUID) result[1])
                .collect(Collectors.toSet());
        Map<UUID, String> userNames = userServiceClient.getUsernameUsers(new ArrayList<>(allUserIds));

        // Build project summaries
        List<ProjectStatisticsResponse.ProjectSummary> projectSummaries = projects.stream()
                .map(project -> {
                    ProjectStatisticsResponse.ProjectSummary summary =
                            new ProjectStatisticsResponse.ProjectSummary();
                    summary.setId(project.getId());
                    summary.setName(project.getName());
                    summary.setDescription(project.getDescription());
                    summary.setCompletionPercentage(
                            projectCompletionPercentages.getOrDefault(project.getId(), 0.0));

                    // Build member summaries
                    List<ProjectStatisticsResponse.MemberSummary> memberSummaries = new ArrayList<>();
                    Map<UUID, Integer> userTaskCounts = projectUserTaskCounts.getOrDefault(
                            project.getId(), Collections.emptyMap());

                    userTaskCounts.forEach((userId, taskCount) -> {
                        ProjectStatisticsResponse.MemberSummary memberSummary =
                                new ProjectStatisticsResponse.MemberSummary();
                        memberSummary.setId(userId);
                        memberSummary.setUsername(userNames.getOrDefault(userId, "Unknown"));
                        memberSummary.setTotalTasks(taskCount);
                        memberSummaries.add(memberSummary);
                    });

                    summary.setMembers(memberSummaries);
                    return summary;
                })
                .collect(Collectors.toList());

        response.setProjectSummaries(projectSummaries);
        return response;
    }

    @Override
    public ProjectOverallStatisticsResponse getProjectOverallStatistics() {
        ProjectOverallStatisticsResponse response = new ProjectOverallStatisticsResponse();
        
        // Get all projects count
        long totalProjects = projectRepository.count();
        response.setTotalProjects(totalProjects);
        
        // Get overall task statistics
        List<Object[]> taskStats = taskRepository.getOverallTaskStatusStats();
        
        ProjectOverallStatisticsResponse.TaskStatusBreakdown statusBreakdown = 
            new ProjectOverallStatisticsResponse.TaskStatusBreakdown();
        
        long totalTasks = 0;
        
        // First pass to get total tasks
        for (Object[] stat : taskStats) {
            TaskStatus status = (TaskStatus) stat[0];
            long count = ((Number) stat[1]).longValue();
            totalTasks += count;
            
            // Set raw counts
            switch (status) {
                case BACK_LOG:
                    statusBreakdown.setBacklogTasks(count);
                    break;
                case DOING:
                    statusBreakdown.setDoingTasks(count);
                    break;
                case ON_HOLD:
                    statusBreakdown.setOnHoldTasks(count);
                    break;
                case DONE:
                    statusBreakdown.setDoneTasks(count);
                    break;
                case ARCHIVED:
                    statusBreakdown.setArchivedTasks(count);
                    break;
            }
        }
        
        response.setTotalTasks(totalTasks);
        
        // Calculate percentages
        if (totalTasks > 0) {
            statusBreakdown.setBacklogPercentage((double) statusBreakdown.getBacklogTasks() / totalTasks * 100);
            statusBreakdown.setDoingPercentage((double) statusBreakdown.getDoingTasks() / totalTasks * 100);
            statusBreakdown.setOnHoldPercentage((double) statusBreakdown.getOnHoldTasks() / totalTasks * 100);
            statusBreakdown.setDonePercentage((double) statusBreakdown.getDoneTasks() / totalTasks * 100);
            statusBreakdown.setArchivedPercentage((double) statusBreakdown.getArchivedTasks() / totalTasks * 100);
        }
        
        // Create a single project stat object for overall statistics
        ProjectOverallStatisticsResponse.ProjectTaskStatusStats overallStats = 
            new ProjectOverallStatisticsResponse.ProjectTaskStatusStats();
        overallStats.setProjectName("Overall");
        overallStats.setTotalTasks(totalTasks);
        overallStats.setCompletionPercentage(statusBreakdown.getDonePercentage());
        overallStats.setStatusBreakdown(statusBreakdown);
        
        response.setProjectStats(Collections.singletonList(overallStats));
        return response;
    }
}
