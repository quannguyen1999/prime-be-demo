package com.prime.repositories;

import com.prime.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    // Find all tasks by projectId
    List<Task> findByProjectId(UUID projectId);

    List<Task> findByProjectIdAndAssignedTo(UUID projectId, UUID assignedTo);
}
