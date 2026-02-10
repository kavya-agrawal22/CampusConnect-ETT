package com.college.campusconnect.repository;

import com.college.campusconnect.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // "SELECT * FROM events WHERE category_id = ?"
    List<Event> findByCategoryId(Long categoryId);

    // "SELECT * FROM events WHERE date_time > ?"
    // This will be used for the "Upcoming Events" feature
    List<Event> findByDateTimeAfter(LocalDateTime currentDateTime);
}