package com.college.campusconnect.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank(message = "Event name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String organizingClub;

    @NotNull(message = "Event date and time are required")
    @Future(message = "Event must be in the future")
    private LocalDateTime dateTime;

    @NotBlank(message = "Venue is required")
    private String venue;

    private String posterUrl; // Optional

    @Min(value = 1, message = "Max attendees must be at least 1")
    private int maxAttendees;

    @Min(value = 0, message = "Price cannot be negative")
    private double registrationPrice;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}