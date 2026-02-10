package com.college.campusconnect.controller;

import com.college.campusconnect.dto.EventDto;
import com.college.campusconnect.dto.UserDto;
import com.college.campusconnect.service.EventService;
import com.college.campusconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EventService eventService;

    // Helper method to get the logged-in user's email
    private String getEmailFromPrincipal(Authentication authentication) {
        return authentication.getName();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(Authentication authentication) {
        String email = getEmailFromPrincipal(authentication);
        return ResponseEntity.ok(userService.getUserProfile(email));
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EventDto>> getMyRegisteredEvents(Authentication authentication) {
        String email = getEmailFromPrincipal(authentication);
        return ResponseEntity.ok(userService.getMyRegisteredEvents(email));
    }

    // UPDATED: Now returns the Razorpay Order ID for payment processing
    @PostMapping("/events/{id}/register")
    public ResponseEntity<Map<String, String>> registerForEvent(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = getEmailFromPrincipal(authentication);

        // This returns the Razorpay Order ID (or "FREE" if price is 0)
        String orderId = eventService.registerForEvent(id, email);

        // Send it to the frontend
        return ResponseEntity.ok(Map.of(
                "message", "Registration initiated",
                "orderId", orderId
        ));
    }

    @DeleteMapping("/events/{id}/unregister")
    public ResponseEntity<String> unregisterFromEvent(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = getEmailFromPrincipal(authentication);
        eventService.unregisterFromEvent(id, email);
        return ResponseEntity.ok("Successfully unregistered from event.");
    }
}