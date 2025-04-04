package com.prime.repositories;

import com.prime.entities.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT p FROM Project p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Project> searchProjects(@Param("keyword") String keyword, PageRequest pageRequest);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.tasks t WHERE t.assignedTo = :userId")
    Page<Project> findProjectsByUserTasks(@Param("userId") UUID userId, PageRequest pageRequest);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.tasks t WHERE t.assignedTo = :userId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Project> findProjectsByUserTasksAndName(@Param("userId") UUID userId, @Param("name") String name, PageRequest pageRequest);
}
