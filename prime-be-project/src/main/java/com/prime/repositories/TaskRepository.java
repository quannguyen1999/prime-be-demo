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
    // Find all tasks by projectId
    List<Task> findByProjectId(UUID projectId);

    List<Task> findByProjectIdAndAssignedTo(UUID projectId, UUID assignedTo);

    @Query("SELECT p FROM Task p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Task> searchTasks(@Param("keyword") String keyword, PageRequest pageRequest);

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
