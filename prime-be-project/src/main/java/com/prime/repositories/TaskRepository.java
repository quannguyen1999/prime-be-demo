package com.prime.repositories;

import com.prime.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    /**
     * Finds all tasks associated with a specific project.
     * 
     * This method retrieves a list of tasks that belong to the specified project.
     * The tasks are returned in their natural order.
     * 
     * @param projectId The UUID of the project to find tasks for
     * @return List of tasks associated with the project
     */
    List<Task> findByProjectId(UUID projectId);

    /**
     * Finds all tasks assigned to a specific user.
     * 
     * This method retrieves a list of tasks that are assigned to the specified user.
     * The tasks are returned in their natural order.
     * 
     * @param assigneeId The UUID of the user to find assigned tasks for
     * @return List of tasks assigned to the user
     */
    List<Task> findByAssigneeId(UUID assigneeId);

    /**
     * Searches for tasks by name using a case-insensitive partial match.
     * 
     * This method performs a search for tasks where the name contains
     * the specified keyword (case-insensitive). The results are paginated.
     * 
     * @param keyword The search term to match against task names
     * @param pageRequest The pagination information (page number and size)
     * @return Page of tasks matching the search criteria
     */
    @Query("SELECT t FROM Task t WHERE " +
            "LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Task> searchTasks(@Param("keyword") String keyword, PageRequest pageRequest);

    /**
     * Finds all tasks with a specific status.
     * 
     * This method retrieves a list of tasks that have the specified status.
     * The tasks are returned in their natural order.
     * 
     * @param status The status to filter tasks by
     * @return List of tasks with the specified status
     */
    List<Task> findByStatus(String status);

    List<Task> findByProjectIdAndAssignedTo(UUID projectId, UUID assignedTo);

    @Query("SELECT p FROM Task p WHERE " +
            "p.assignedTo = :assignIdUser")
    Page<Task> searchTasksByAssignIdUser(@Param("assignIdUser") UUID assignIdUser, PageRequest pageRequest);

    @Query("SELECT p FROM Task p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) and p.assignedTo = :assignIdUser")
    Page<Task> searchTaskByKeyWordAndAssignIdUser(@Param("keyword") String keyword, @Param("assignIdUser") UUID assignIdUser, PageRequest pageRequest);

    @Query("SELECT t.status as status, COUNT(t) as count FROM Task t GROUP BY t.status")
    List<Object[]> countTasksByStatus();

    @Query("SELECT t.project.id as projectId, t.assignedTo as userId, COUNT(t) as taskCount " +
            "FROM Task t GROUP BY t.project.id, t.assignedTo")
    List<Object[]> countTasksByProjectAndUser();

    @Query("SELECT t.project.id as projectId, COUNT(t) as totalTasks, " +
            "COUNT(CASE WHEN t.status = 'DONE' THEN 1 END) as completedTasks " +
            "FROM Task t GROUP BY t.project.id")
    List<Object[]> getProjectCompletionStats();

    @Query("SELECT t.status as status, COUNT(t) as count " +
           "FROM Task t " +
           "GROUP BY t.status")
    List<Object[]> getOverallTaskStatusStats();
}
