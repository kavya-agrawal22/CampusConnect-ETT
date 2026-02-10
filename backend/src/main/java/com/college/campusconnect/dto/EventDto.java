package com.college.campusconnect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    private String name;
    private String description;
    private String organizingClub;
    private LocalDateTime dateTime;
    private String venue;
    private String posterUrl;
    private int maxAttendees;
    private double registrationPrice;


    private String categoryName;

    // We'll calculate the number of attendees and send it as a simple number
    private int registeredAttendeesCount;
}