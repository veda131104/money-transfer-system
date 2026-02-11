package com.company.mts.repository;

import com.company.mts.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
    Optional<AuthUser> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
