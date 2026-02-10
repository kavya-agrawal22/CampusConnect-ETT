package com.college.campusconnect.service;

import com.college.campusconnect.dto.AuthRequest;
import com.college.campusconnect.dto.JwtAuthResponse;
import com.college.campusconnect.dto.RegisterRequest;
import com.college.campusconnect.entity.Role;
import com.college.campusconnect.entity.User;
import com.college.campusconnect.exception.ResourceNotFoundException;
import com.college.campusconnect.repository.RoleRepository;
import com.college.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MapperService mapperService;

    public JwtAuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }

        // Create new user's account
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobileNumber(request.getMobileNumber())
                .department(request.getDepartment())
                .registrationNumber(request.getRegistrationNumber())
                .year(request.getYear())
                .gender(request.getGender())
                .build();

        // Find and set the default role "ROLE_STUDENT"
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found. Please seed database."));

        Set<Role> roles = new HashSet<>();
        roles.add(studentRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // Generate token and create response
        String jwtToken = jwtService.generateToken(user);
        return JwtAuthResponse.builder()
                .token(jwtToken)
                .user(mapperService.mapToUserDto(savedUser))
                .build();
    }

    public JwtAuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String jwtToken = jwtService.generateToken(user);

        return JwtAuthResponse.builder()
                .token(jwtToken)
                .user(mapperService.mapToUserDto(user))
                .build();
    }
}