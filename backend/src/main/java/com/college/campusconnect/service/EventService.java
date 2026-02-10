package com.college.campusconnect.service;

import com.college.campusconnect.dto.EventDto;
import com.college.campusconnect.dto.EventRequest;
import com.college.campusconnect.dto.UserDto;
import com.college.campusconnect.entity.Category;
import com.college.campusconnect.entity.Event;
import com.college.campusconnect.entity.Registration;
import com.college.campusconnect.entity.User;
import com.college.campusconnect.exception.ResourceNotFoundException;
import com.college.campusconnect.repository.CategoryRepository;
import com.college.campusconnect.repository.EventRepository;
import com.college.campusconnect.repository.RegistrationRepository;
import com.college.campusconnect.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository; // Inject new repo
    private final MapperService mapperService;

    // --- Razorpay Configuration ---
    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        // Initialize the client only if keys are present to avoid errors during testing
        if (razorpayKeyId != null && !razorpayKeyId.isEmpty()) {
            this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        }
    }

    // --- Admin Functions ---

    public EventDto createEvent(EventRequest eventRequest) {
        Category category = categoryRepository.findById(eventRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", eventRequest.getCategoryId()));

        Event event = new Event();
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setOrganizingClub(eventRequest.getOrganizingClub());
        event.setDateTime(eventRequest.getDateTime());
        event.setVenue(eventRequest.getVenue());
        event.setPosterUrl(eventRequest.getPosterUrl());
        event.setMaxAttendees(eventRequest.getMaxAttendees());
        event.setRegistrationPrice(eventRequest.getRegistrationPrice());
        event.setCategory(category);

        Event savedEvent = eventRepository.save(event);
        return mapperService.mapToEventDto(savedEvent);
    }

    public EventDto updateEvent(Long eventId, EventRequest eventRequest) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        Category category = categoryRepository.findById(eventRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", eventRequest.getCategoryId()));

        // Update all fields
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setOrganizingClub(eventRequest.getOrganizingClub());
        event.setDateTime(eventRequest.getDateTime());
        event.setVenue(eventRequest.getVenue());
        event.setPosterUrl(eventRequest.getPosterUrl());
        event.setMaxAttendees(eventRequest.getMaxAttendees());
        event.setRegistrationPrice(eventRequest.getRegistrationPrice());
        event.setCategory(category);

        Event updatedEvent = eventRepository.save(event);
        return mapperService.mapToEventDto(updatedEvent);
    }

    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        eventRepository.delete(event);
    }

    public List<UserDto> getEventAttendees(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        // FIX: Use Registration Repository to find attendees
        return registrationRepository.findByEvent(event).stream()
                .map(registration -> mapperService.mapToUserDto(registration.getUser()))
                .collect(Collectors.toList());
    }

    // --- Public Functions ---

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(mapperService::mapToEventDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findByDateTimeAfter(LocalDateTime.now()).stream()
                .map(mapperService::mapToEventDto)
                .collect(Collectors.toList());
    }

    public EventDto getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        return mapperService.mapToEventDto(event);
    }

    public List<EventDto> getEventsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        return eventRepository.findByCategoryId(categoryId).stream()
                .map(mapperService::mapToEventDto)
                .collect(Collectors.toList());
    }

    // --- User Functions (UPDATED FOR PAYMENT) ---

    // Returns String (Razorpay Order ID) instead of void
    public String registerForEvent(Long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // 1. Check if already registered
        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("User is already registered for this event.");
        }

        // 2. Check Capacity
        if (event.getRegistrations().size() >= event.getMaxAttendees()) {
            throw new RuntimeException("Event is already full.");
        }

        try {
            // 3. Create Razorpay Order
            double amount = event.getRegistrationPrice();

            // If event is free, create a generic "paid" registration immediately
            if (amount <= 0) {
                createRegistration(user, event, "FREE_EVENT", "PAID", 0);
                return "FREE";
            }

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(amount * 100)); // Convert to paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            // 4. Save Registration as "PENDING"
            createRegistration(user, event, razorpayOrderId, "PENDING", amount);

            return razorpayOrderId;

        } catch (RazorpayException e) {
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }

    private void createRegistration(User user, Event event, String orderId, String status, double amount) {
        Registration registration = Registration.builder()
                .user(user)
                .event(event)
                .razorpayOrderId(orderId)
                .paymentStatus(status)
                .amountPaid(amount)
                .registrationTime(LocalDateTime.now())
                .build();
        registrationRepository.save(registration);
    }

    public void unregisterFromEvent(Long eventId, String userEmail) {
        // Logic to unregister (admin only usually for paid events, or refund logic)
        // For now, simpler implementation:
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Registration registration = registrationRepository.findByUser(user).stream()
                .filter(r -> r.getEvent().getId().equals(eventId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not registered"));

        registrationRepository.delete(registration);
    }
}