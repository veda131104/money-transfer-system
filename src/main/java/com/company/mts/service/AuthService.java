package com.company.mts.service;

import com.company.mts.dto.LoginRequest;
import com.company.mts.dto.SignupRequest;
import com.company.mts.entity.AuthUser;
import com.company.mts.exception.DuplicateUserException;
import com.company.mts.exception.InvalidCredentialsException;
import com.company.mts.repository.AuthUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    private final AuthUserRepository authUserRepository;

    public AuthService(AuthUserRepository authUserRepository) {
        this.authUserRepository = authUserRepository;
    }

    public AuthUser signup(SignupRequest request) {
        String name = request.getName().trim();
        if (authUserRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateUserException("Username already in use");
        }

        AuthUser user = new AuthUser();
        user.setName(name);
        user.setPassword(request.getPassword());

        log.info("Saving new user to database: name={}", name);
        AuthUser saved = authUserRepository.save(user);
        log.info("User saved successfully with ID: {}", saved.getId());

        return saved;
    }

    public AuthUser login(LoginRequest request) {
        AuthUser user = authUserRepository
                .findByNameIgnoreCase(request.getName().trim())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return user;
    }
}
