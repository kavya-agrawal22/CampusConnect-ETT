package com.college.campusconnect.service;

import com.college.campusconnect.dto.CategoryDto;
import com.college.campusconnect.dto.EventDto;
import com.college.campusconnect.dto.UserDto;
import com.college.campusconnect.entity.Category;
import com.college.campusconnect.entity.Event;
import com.college.campusconnect.entity.User;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class MapperService {

    public UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setMobileNumber(user.getMobileNumber());
        userDto.setDepartment(user.getDepartment());
        userDto.setRegistrationNumber(user.getRegistrationNumber());
        userDto.setYear(user.getYear());
        userDto.setGender(user.getGender());
        userDto.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet()));
        return userDto;
    }

    public EventDto mapToEventDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setId(event.getId());
        eventDto.setName(event.getName());
        eventDto.setDescription(event.getDescription());
        eventDto.setOrganizingClub(event.getOrganizingClub());
        eventDto.setDateTime(event.getDateTime());
        eventDto.setVenue(event.getVenue());
        eventDto.setPosterUrl(event.getPosterUrl());
        eventDto.setMaxAttendees(event.getMaxAttendees());
        eventDto.setRegistrationPrice(event.getRegistrationPrice());

        // Map related data
        eventDto.setCategoryName(event.getCategory().getName());


        eventDto.setRegisteredAttendeesCount(event.getRegistrations().size());

        return eventDto;
    }

    public CategoryDto mapToCategoryDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        categoryDto.setDescription(category.getDescription());
        return categoryDto;
    }
}