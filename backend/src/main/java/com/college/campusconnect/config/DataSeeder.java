package com.college.campusconnect.config;

import com.college.campusconnect.entity.Role;
import com.college.campusconnect.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create ROLE_STUDENT if it doesn't exist
        if (roleRepository.findByName("ROLE_STUDENT").isEmpty()) {
            Role studentRole = new Role();
            studentRole.setName("ROLE_STUDENT");
            roleRepository.save(studentRole);
        }

        // Create ROLE_ADMIN if it doesn't exist
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }

        // Create ROLE_FACULTY if it doesn't exist
        if (roleRepository.findByName("ROLE_FACULTY").isEmpty()) {
            Role facultyRole = new Role();
            facultyRole.setName("ROLE_FACULTY");
            roleRepository.save(facultyRole);
        }
    }
}