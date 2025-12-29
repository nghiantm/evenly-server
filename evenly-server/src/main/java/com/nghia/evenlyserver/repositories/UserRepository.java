package com.nghia.evenlyserver.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nghia.evenlyserver.domain.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByIdpSubject(String idpSubject);
}
