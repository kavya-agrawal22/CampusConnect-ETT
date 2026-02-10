package com.college.campusconnect.service;

import com.college.campusconnect.dto.EventDto;
import com.college.campusconnect.dto.UserDto;
import com.college.campusconnect.entity.User;
import com.college.campusconnect.exception.ResourceNotFoundException;
import com.college.campusconnect.repository.RegistrationRepository;
import com.college.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository; // Inject the new repo
    private final MapperService mapperService;

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapperService.mapToUserDto(user);
    }

    public List<EventDto> getMyRegisteredEvents(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // FIX: We now find registrations via the repository, NOT user.getRegisteredEvents()
        return registrationRepository.findByUser(user).stream()
                .map(registration -> mapperService.mapToEventDto(registration.getEvent()))
                .collect(Collectors.toList());
    }
}