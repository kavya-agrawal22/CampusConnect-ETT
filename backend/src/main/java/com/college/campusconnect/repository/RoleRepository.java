package com.college.campusconnect.repository;

import com.college.campusconnect.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    // Spring Data JPA automatically creates the query:
    // "SELECT * FROM roles WHERE name = ?"
    Optional<Role> findByName(String name);
}