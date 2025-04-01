package com.prime.repositories;

import com.prime.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUsername(String userName);

    User findByEmail(String email);

    @Query("SELECT u.id, u.username FROM User u WHERE u.id IN :uuids")
    List<Object[]> findUserIdAndUsernameByIds(@Param("uuids") List<UUID> uuids);

}
