package com.college.campusconnect.repository;

import com.college.campusconnect.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // No custom methods needed yet.
    // We already get save(), findById(), findAll(), deleteById(), etc.
}