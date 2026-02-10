package com.college.campusconnect.repository;

import com.college.campusconnect.entity.Registration;
import com.college.campusconnect.entity.User;
import com.college.campusconnect.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Find all registrations for a specific user (for "My Dashboard")
    List<Registration> findByUser(User user);

    // Find all registrations for a specific event (for Admin "View Attendees")
    List<Registration> findByEvent(Event event);

    // Find a registration by the Razorpay Order ID (crucial for payment verification)
    Optional<Registration> findByRazorpayOrderId(String orderId);

    // Check if a user is already registered for an event
    boolean existsByUserAndEvent(User user, Event event);
}