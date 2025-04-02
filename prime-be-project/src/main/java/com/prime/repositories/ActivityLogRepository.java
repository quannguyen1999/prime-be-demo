package com.prime.repositories;

import com.prime.entities.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
    Page<ActivityLog> findByProjectId(String projectId, Pageable pageable);

    Page<ActivityLog> findByUserId(String userId, Pageable pageable);


}
