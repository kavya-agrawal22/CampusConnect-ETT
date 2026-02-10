package com.college.campusconnect.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String organizingClub;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String venue;

    private String posterUrl;

    private int maxAttendees;

    private double registrationPrice;

    // Relationship: Many Events belong to One Category (Unchanged)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // NEW Relationship: One Event has Many Registrations
    // This replaces the old "attendees" ManyToMany list
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private Set<Registration> registrations = new HashSet<>();
}