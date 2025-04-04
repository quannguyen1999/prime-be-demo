package com.prime.aspects;

import com.prime.annotations.Audited;
import com.prime.constants.EntityType;
import com.prime.entities.Project;
import com.prime.entities.Task;
import com.prime.models.response.ProjectResponse;
import com.prime.models.response.TaskResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.repositories.TaskRepository;
import com.prime.service.ActivityLogService;
import com.prime.utils.SecurityUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Method;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditAspect {

    private final ActivityLogService activityLogService;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    // Entity extractors map
    private final Map<EntityType, EntityExtractor> entityExtractors = new EnumMap<>(EntityType.class);

    // Description builders map
    private final Map<EntityType, DescriptionBuilder> descriptionBuilders = new EnumMap<>(EntityType.class);

    @PostConstruct
    public void init() {
        // Initialize entity extractors
        entityExtractors.put(EntityType.PROJECT, new ProjectEntityExtractor(projectRepository));
        entityExtractors.put(EntityType.TASK, new TaskEntityExtractor(taskRepository));

        // Initialize description builders
        descriptionBuilders.put(EntityType.PROJECT, new ProjectDescriptionBuilder());
        descriptionBuilders.put(EntityType.TASK, new TaskDescriptionBuilder());
    }

    @Around("@annotation(com.prime.annotations.Audited)")
    @Transactional
    public Object auditMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Audited auditAnnotation = method.getAnnotation(Audited.class);

        EntityType entityType = auditAnnotation.entityType();
        EntityExtractor extractor = entityExtractors.get(entityType);
        DescriptionBuilder descriptionBuilder = descriptionBuilders.get(entityType);

        if (extractor == null || descriptionBuilder == null) {
            log.warn("No extractor or description builder found for entity type: {}", entityType);
            return joinPoint.proceed();
        }

        // Extract entity information before the method execution
        Object[] args = joinPoint.getArgs();
        Object oldEntity = extractor.extractEntity(method, args);
        EntityInfo entityInfo = extractor.extractEntityInfo(oldEntity);

        // Execute the method
        Object result = joinPoint.proceed();

        try {
            // Build description
            String description = auditAnnotation.description();
            if (description.isEmpty()) {
                description = descriptionBuilder.buildDescription(method.getName(), result, oldEntity);
            }

            // Log the activity
            activityLogService.logActivity(
                SecurityUtil.getIDUser().toString(),
                entityInfo.getProjectId(),
                auditAnnotation.activityType()
            );
        } catch (Exception e) {
            log.error("Failed to log activity for method: {}", method.getName(), e);
        }

        return result;
    }

    // Interface for entity extraction
    private interface EntityExtractor {
        Object extractEntity(Method method, Object[] args);
        EntityInfo extractEntityInfo(Object entity);
    }

    // Interface for description building
    private interface DescriptionBuilder {
        String buildDescription(String methodName, Object result, Object oldEntity);
    }

    // Entity information holder
    private static class EntityInfo {
        private final String projectId;
        private final String taskId;

        public EntityInfo(String projectId, String taskId) {
            this.projectId = projectId;
            this.taskId = taskId;
        }

        public String getProjectId() {
            return projectId;
        }

        public String getTaskId() {
            return taskId;
        }
    }

    // Project entity extractor
    private static class ProjectEntityExtractor implements EntityExtractor {
        private final ProjectRepository projectRepository;

        public ProjectEntityExtractor(ProjectRepository projectRepository) {
            this.projectRepository = projectRepository;
        }

        @Override
        public Object extractEntity(Method method, Object[] args) {
            if (method.getName().contains("update") || method.getName().contains("delete")) {
                UUID id = (UUID) args[method.getName().contains("update") ? 1 : 0];
                return projectRepository.findById(id).orElse(null);
            }
            return null;
        }

        @Override
        public EntityInfo extractEntityInfo(Object entity) {
            if (entity instanceof Project) {
                return new EntityInfo(((Project) entity).getId().toString(), null);
            }
            return new EntityInfo(null, null);
        }
    }

    // Task entity extractor
    private static class TaskEntityExtractor implements EntityExtractor {
        private final TaskRepository taskRepository;

        public TaskEntityExtractor(TaskRepository taskRepository) {
            this.taskRepository = taskRepository;
        }

        @Override
        public Object extractEntity(Method method, Object[] args) {
            if (method.getName().contains("update") || method.getName().contains("delete")) {
                UUID id = (UUID) args[method.getName().contains("update") ? 1 : 0];
                Task task = taskRepository.findById(id).orElse(null);
                if (task != null) {
                    Hibernate.initialize(task.getProject());
                }
                return task;
            }
            return null;
        }

        @Override
        public EntityInfo extractEntityInfo(Object entity) {
            if (entity instanceof Task) {
                Task task = (Task) entity;
                return new EntityInfo(
                    task.getProject().getId().toString(),
                    task.getId().toString()
                );
            }
            return new EntityInfo(null, null);
        }
    }

    // Project description builder
    private static class ProjectDescriptionBuilder implements DescriptionBuilder {
        @Override
        public String buildDescription(String methodName, Object result, Object oldEntity) {
            if (methodName.contains("create") && result instanceof ProjectResponse) {
                return "Project created: " + ((ProjectResponse) result).getName();
            } else if (methodName.contains("update") && result instanceof ProjectResponse) {
                return "Project updated: " + ((ProjectResponse) result).getName();
            } else if (methodName.contains("delete") && oldEntity instanceof Project) {
                return "Project deleted: " + ((Project) oldEntity).getName();
            }
            return methodName;
        }
    }

    // Task description builder
    private static class TaskDescriptionBuilder implements DescriptionBuilder {
        @Override
        public String buildDescription(String methodName, Object result, Object oldEntity) {
            if (methodName.contains("create") && result instanceof TaskResponse) {
                return "Task created: " + ((TaskResponse) result).getTitle();
            } else if (methodName.contains("update") && result instanceof TaskResponse) {
                return "Task updated: " + ((TaskResponse) result).getTitle();
            } else if (methodName.contains("delete") && oldEntity instanceof Task) {
                return "Task deleted: " + ((Task) oldEntity).getTitle();
            }
            return methodName;
        }
    }
} 