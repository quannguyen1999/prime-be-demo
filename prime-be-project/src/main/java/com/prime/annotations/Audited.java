package com.prime.annotations;

import com.prime.constants.ActivityType;
import com.prime.constants.EntityType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation used to mark methods that should be audited for activity logging.
 * 
 * This annotation is processed by the {@link com.prime.aspects.AuditAspect} aspect,
 * which automatically logs activities when annotated methods are executed.
 * 
 * The annotation supports:
 * - Specifying the type of activity being performed
 * - Identifying the entity type being modified
 * - Providing a custom description for the activity
 * 
 * Example usage:
 * <pre>
 * {@code
 * @Audited(activityType = ActivityType.TASK_CREATED, entityType = EntityType.TASK)
 * public TaskResponse createTask(TaskRequest request) {
 *     // Task creation logic
 * }
 * }
 * </pre>
 * 
 * @see com.prime.aspects.AuditAspect
 * @see com.prime.constants.ActivityType
 * @see com.prime.constants.EntityType
 * @see com.prime.service.ActivityLogService
 * 
 * @author Prime Team
 * @version 1.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audited {
    /**
     * The type of activity being performed.
     * This determines how the activity will be logged and categorized.
     * 
     * @return The activity type
     */
    ActivityType activityType();

    /**
     * The type of entity being modified.
     * Used to identify the entity in the activity log.
     * 
     * @return The entity type
     */
    EntityType entityType();

    /**
     * Optional custom description for the activity.
     * If not provided, a default description will be generated based on the method name
     * and the entities involved.
     * 
     * @return The custom description, or empty string if using default
     */
    String description() default "";
} 