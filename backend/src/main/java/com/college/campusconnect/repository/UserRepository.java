package com.college.campusconnect.repository;

import com.college.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // "SELECT * FROM users WHERE email = ?"
    // This is CRITICAL for Spring Security to load the user for login.
    Optional<User> findByEmail(String email);

    // "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = ?"
    // This is a fast way to check if an email is already taken.
    Boolean existsByEmail(String email);
}