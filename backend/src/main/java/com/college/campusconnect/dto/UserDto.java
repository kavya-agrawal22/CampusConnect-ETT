package com.college.campusconnect.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private String department;
    private String registrationNumber;
    private Integer year;
    private String gender;

    // We will send the role names as simple strings
    private Set<String> roles;
}